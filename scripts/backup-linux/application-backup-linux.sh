#!/bin/bash

# DCE Application Backup Script for Linux Environment
# Script backup application files cho Linux environment

# Default parameters
BACKUP_PATH="/home/dopt/Desktop/App/backup/BackupApp"
SOURCE_PATH="/home/dopt/Desktop/App"
COMPRESS=true
CLEANUP=true
RETENTION_DAYS=7
COMPRESSION_LEVEL=4
COMPRESSION_TYPE="lz4"
PARALLEL_JOBS=8
INCLUDE_UPLOADS=true
UPLOADS_MAX_SIZE="2GB"
INCLUDE_DOCKER=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --path)
            BACKUP_PATH="$2"
            shift 2
            ;;
        --source)
            SOURCE_PATH="$2"
            shift 2
            ;;
        --compress)
            COMPRESS=true
            shift
            ;;
        --no-compress)
            COMPRESS=false
            shift
            ;;
        --cleanup)
            CLEANUP=true
            shift
            ;;
        --retention)
            RETENTION_DAYS="$2"
            shift 2
            ;;
        --compression-level)
            COMPRESSION_LEVEL="$2"
            shift 2
            ;;
        --compression-type)
            COMPRESSION_TYPE="$2"
            shift 2
            ;;
        --parallel)
            PARALLEL_JOBS="$2"
            shift 2
            ;;
        --include-uploads)
            INCLUDE_UPLOADS=true
            shift
            ;;
        --uploads-max-size)
            UPLOADS_MAX_SIZE="$2"
            shift 2
            ;;
        --include-docker)
            INCLUDE_DOCKER=true
            shift
            ;;
        --no-include-docker)
            INCLUDE_DOCKER=false
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --path PATH        Backup path (default: /home/dopt/Desktop/App/backup/BackupApp)"
            echo "  --source PATH      Source path (default: /home/dopt/Desktop/App)"
            echo "  --compress         Enable compression (default: true)"
            echo "  --no-compress      Disable compression"
            echo "  --cleanup          Clean up old backups (default: true)"
            echo "  --retention DAYS   Retention days for cleanup (default: 7)"
            echo "  --compression-level LEVEL Compression level 1-9 (default: 4)"
            echo "  --compression-type TYPE   gzip, bzip2, xz, lz4, 7z (default: lz4)"
            echo "  --parallel JOBS    Number of parallel jobs (default: 8)"
            echo "  --include-uploads  Include uploads folder in backup (default: true)"
            echo "  --uploads-max-size SIZE Max uploads size (default: 2GB)"
            echo "  --include-docker   Include Docker image backup (default: false)"
            echo "  --no-include-docker Disable Docker image backup"
            echo "  --help             Show this help"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# Function to check if source directory exists
check_source() {
    if [ ! -d "$SOURCE_PATH" ]; then
        print_error "Source directory does not exist: $SOURCE_PATH"
        exit 1
    fi
    print_status "Source directory: $SOURCE_PATH"
}

# Function to create backup directory
create_backup_dir() {
    mkdir -p "$BACKUP_PATH"
    if [ $? -eq 0 ]; then
        print_status "Backup directory created: $BACKUP_PATH"
    else
        print_error "Failed to create backup directory: $BACKUP_PATH"
        exit 1
    fi
}

# Function to get directory size
get_directory_size() {
    local dir="$1"
    du -sh "$dir" 2>/dev/null | cut -f1
}

# Function to check uploads size and optimize compression
check_uploads_size() {
    if [ "$INCLUDE_UPLOADS" = true ] && [ -d "${SOURCE_PATH}/uploads" ]; then
        local uploads_size=$(du -sm "${SOURCE_PATH}/uploads" 2>/dev/null | cut -f1)
        local uploads_size_mb=$((uploads_size))
        
        # Convert max size to MB for comparison
        local max_size_mb=1024  # Default 1GB
        case $UPLOADS_MAX_SIZE in
            *GB) max_size_mb=$(echo $UPLOADS_MAX_SIZE | sed 's/GB//') && max_size_mb=$((max_size_mb * 1024));;
            *MB) max_size_mb=$(echo $UPLOADS_MAX_SIZE | sed 's/MB//');;
            *KB) max_size_mb=$(echo $UPLOADS_MAX_SIZE | sed 's/KB//') && max_size_mb=$((max_size_mb / 1024));;
        esac
        
        if [ $uploads_size_mb -gt $max_size_mb ]; then
            print_warning "Uploads size ($uploads_size_mb MB) exceeds limit ($max_size_mb MB)"
            print_warning "Consider using --uploads-max-size to increase limit or exclude uploads"
            return 1
        fi
        
        print_status "Uploads size: ${uploads_size}MB (within limit: ${max_size_mb}MB)"
        
        # Optimize compression for many small files
        if [ $uploads_size_mb -gt 100 ]; then
            print_status "Large uploads detected, optimizing compression for many small files"
            # Keep lz4 for speed with many small files (lz4 is available and faster)
            if [ "$COMPRESSION_TYPE" = "gzip" ]; then
                COMPRESSION_TYPE="lz4"
                COMPRESSION_LEVEL=1
                print_status "Switched to lz4 compression for better performance with many small files"
            fi
        fi
    fi
}

# Function to create application backup
create_app_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_name="dce_app_${timestamp}"
    local temp_dir="/tmp/${backup_name}"
    local final_backup=""
    
    print_step "Creating application backup..."
    
    # Create temporary directory
    mkdir -p "$temp_dir"
    
    # Check uploads size and optimize if needed
    check_uploads_size
    
    # Copy application files (excluding node_modules, .git, etc.)
    print_step "Copying application files..."
    
    # Copy backend (excluding node_modules) - parallel
    if [ -d "${SOURCE_PATH}/backend" ]; then
        print_status "Copying backend files..."
        rsync -av --exclude='node_modules' --exclude='*.log' \
            --progress --stats "${SOURCE_PATH}/backend/" "$temp_dir/backend/" &
        BACKEND_COPY_PID=$!
    fi
    
    # Copy uploads folder separately if requested
    if [ "$INCLUDE_UPLOADS" = true ] && [ -d "${SOURCE_PATH}/uploads" ]; then
        print_status "Copying uploads folder with optimized settings for many small files..."
        rsync -av --exclude='*.tmp' --exclude='*.temp' \
            --progress --stats --no-whole-file \
            --block-size=8192 \
            "${SOURCE_PATH}/uploads/" "$temp_dir/uploads/" &
        UPLOADS_COPY_PID=$!
    fi
    
    # Copy frontend (excluding node_modules and dist) - parallel
    if [ -d "${SOURCE_PATH}/frontend" ]; then
        print_status "Copying frontend files..."
        rsync -av --exclude='node_modules' --exclude='dist' --exclude='*.log' \
            --progress --stats "${SOURCE_PATH}/frontend/" "$temp_dir/frontend/" &
        FRONTEND_COPY_PID=$!
    fi
    
    # Copy scripts
    if [ -d "${SOURCE_PATH}/scripts" ]; then
        print_status "Copying scripts..."
        cp -r "${SOURCE_PATH}/scripts" "$temp_dir/"
    fi
    
    # Wait for parallel copy operations to complete
    if [ -n "$BACKEND_COPY_PID" ]; then
        wait $BACKEND_COPY_PID
        print_status "Backend copy completed"
    fi
    
    if [ -n "$FRONTEND_COPY_PID" ]; then
        wait $FRONTEND_COPY_PID
        print_status "Frontend copy completed"
    fi
    
    if [ -n "$UPLOADS_COPY_PID" ]; then
        wait $UPLOADS_COPY_PID
        print_status "Uploads copy completed"
    fi
    
    # Copy important config files
    if [ -f "${SOURCE_PATH}/.env" ]; then
        cp "${SOURCE_PATH}/.env" "$temp_dir/"
    fi
    
    if [ -f "${SOURCE_PATH}/docker-compose.yml" ]; then
        cp "${SOURCE_PATH}/docker-compose.yml" "$temp_dir/"
    fi
    
    # Create backup info file
    cat > "$temp_dir/backup_info.txt" << EOF
DCE Application Backup
======================
Timestamp: $(date)
Source: $SOURCE_PATH
Backup Type: Application Files
Excluded: node_modules, dist, logs$(if [ "$INCLUDE_UPLOADS" = false ]; then echo ", uploads"; fi)

Directories included:
- backend/ (excluding node_modules)
- frontend/ (excluding node_modules, dist)
- scripts/
- Configuration files$(if [ "$INCLUDE_UPLOADS" = true ]; then echo "
- uploads/ (included with optimized settings for many small files)"; fi)

Backup created by: $0
EOF
    
    # Create compressed archive with optimized compression
    if [ "$COMPRESS" = true ]; then
        print_step "Creating compressed archive with $COMPRESSION_TYPE (level $COMPRESSION_LEVEL)..."
        
        case $COMPRESSION_TYPE in
            "gzip")
                final_backup="${BACKUP_PATH}/${backup_name}.tar.gz"
                # Optimize tar for many small files
                if [ "$INCLUDE_UPLOADS" = true ]; then
                    tar -cf - --use-compress-program="gzip -$COMPRESSION_LEVEL" \
                        --exclude='*.tmp' --exclude='*.temp' \
                        -C /tmp "$backup_name" > "$final_backup"
                else
                    tar -cf - -C /tmp "$backup_name" | gzip -$COMPRESSION_LEVEL > "$final_backup"
                fi
                ;;
            "bzip2")
                final_backup="${BACKUP_PATH}/${backup_name}.tar.bz2"
                # Optimize tar for many small files
                if [ "$INCLUDE_UPLOADS" = true ]; then
                    tar -cf - --use-compress-program="bzip2 -$COMPRESSION_LEVEL" \
                        --exclude='*.tmp' --exclude='*.temp' \
                        -C /tmp "$backup_name" > "$final_backup"
                else
                    tar -cf - -C /tmp "$backup_name" | bzip2 -$COMPRESSION_LEVEL > "$final_backup"
                fi
                ;;
            "xz")
                final_backup="${BACKUP_PATH}/${backup_name}.tar.xz"
                # Optimize tar for many small files with parallel compression
                if [ "$INCLUDE_UPLOADS" = true ]; then
                    tar -cf - --use-compress-program="xz -$COMPRESSION_LEVEL -T$PARALLEL_JOBS" \
                        --exclude='*.tmp' --exclude='*.temp' \
                        -C /tmp "$backup_name" > "$final_backup"
                else
                    tar -cf - -C /tmp "$backup_name" | xz -$COMPRESSION_LEVEL -T$PARALLEL_JOBS > "$final_backup"
                fi
                ;;
            "lz4")
                final_backup="${BACKUP_PATH}/${backup_name}.tar.lz4"
                # Optimize tar for many small files - lz4 is best for speed
                if [ "$INCLUDE_UPLOADS" = true ]; then
                    tar -cf - --use-compress-program="lz4 -$COMPRESSION_LEVEL" \
                        --exclude='*.tmp' --exclude='*.temp' \
                        -C /tmp "$backup_name" > "$final_backup"
                else
                    tar -cf - -C /tmp "$backup_name" | lz4 -$COMPRESSION_LEVEL > "$final_backup"
                fi
                ;;
            "7z")
                final_backup="${BACKUP_PATH}/${backup_name}.7z"
                # 7zip compression - best compression ratio
                cd /tmp
                7z a -t7z -m0=lzma2 -mx=$COMPRESSION_LEVEL -mmt=$PARALLEL_JOBS "$final_backup" "$backup_name" > /dev/null
                cd - > /dev/null
                ;;
            *)
                print_warning "Unknown compression type: $COMPRESSION_TYPE, using gzip"
                final_backup="${BACKUP_PATH}/${backup_name}.tar.gz"
                tar -cf - -C /tmp "$backup_name" | gzip -$COMPRESSION_LEVEL > "$final_backup"
                ;;
        esac
    else
        print_step "Creating archive..."
        final_backup="${BACKUP_PATH}/${backup_name}.tar"
        tar -cf "$final_backup" -C /tmp "$backup_name"
    fi
    
    # Clean up temporary directory
    rm -rf "$temp_dir"
    
    if [ -f "$final_backup" ]; then
        print_status "Application backup completed: $(basename "$final_backup")"
        echo "$final_backup"
        return 0
    else
        print_error "Application backup failed"
        return 1
    fi
}

# Function to create Docker backup
create_docker_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_name="dce_docker_${timestamp}"
    local backup_file="${BACKUP_PATH}/${backup_name}.tar.gz"
    
    print_step "Creating Docker backup..."
    
    # Save Docker images with optimized compression
    if docker images | grep -q "mcr.microsoft.com/mssql/server"; then
        print_status "Saving Docker images with $COMPRESSION_TYPE compression..."
        case $COMPRESSION_TYPE in
            "gzip")
                docker save mcr.microsoft.com/mssql/server:2022-latest | gzip -$COMPRESSION_LEVEL > "$backup_file"
                ;;
            "bzip2")
                backup_file="${BACKUP_PATH}/${backup_name}.tar.bz2"
                docker save mcr.microsoft.com/mssql/server:2022-latest | bzip2 -$COMPRESSION_LEVEL > "$backup_file"
                ;;
            "xz")
                backup_file="${BACKUP_PATH}/${backup_name}.tar.xz"
                docker save mcr.microsoft.com/mssql/server:2022-latest | xz -$COMPRESSION_LEVEL -T$PARALLEL_JOBS > "$backup_file"
                ;;
            "lz4")
                backup_file="${BACKUP_PATH}/${backup_name}.tar.lz4"
                docker save mcr.microsoft.com/mssql/server:2022-latest | lz4 -$COMPRESSION_LEVEL > "$backup_file"
                ;;
            *)
                docker save mcr.microsoft.com/mssql/server:2022-latest | gzip -$COMPRESSION_LEVEL > "$backup_file"
                ;;
        esac
        
        if [ -f "$backup_file" ]; then
            print_status "Docker backup completed: $(basename "$backup_file")"
            echo "$backup_file"
            return 0
        else
            print_error "Docker backup failed"
            return 1
        fi
    else
        print_warning "No DCE Docker images found"
        return 0
    fi
}

# Function to create configuration backup
create_config_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_name="dce_config_${timestamp}"
    local backup_file="${BACKUP_PATH}/${backup_name}.tar.gz"
    
    print_step "Creating configuration backup..."
    
    # Create temporary directory for config files
    local temp_dir="/tmp/${backup_name}"
    mkdir -p "$temp_dir"
    
    # Copy important configuration files
    if [ -f "${SOURCE_PATH}/backend/.env" ]; then
        cp "${SOURCE_PATH}/backend/.env" "$temp_dir/"
    fi
    
    if [ -f "${SOURCE_PATH}/backend/docker-compose.yml" ]; then
        cp "${SOURCE_PATH}/backend/docker-compose.yml" "$temp_dir/"
    fi
    
    if [ -d "${SOURCE_PATH}/backend/sqlserver" ]; then
        cp -r "${SOURCE_PATH}/backend/sqlserver" "$temp_dir/"
    fi
    
    # Create config info file
    cat > "$temp_dir/config_info.txt" << EOF
DCE Configuration Backup
========================
Timestamp: $(date)
Source: $SOURCE_PATH
Backup Type: Configuration Files

Files included:
- backend/.env
- backend/docker-compose.yml
- backend/sqlserver/ (init scripts and backups)

Backup created by: $0
EOF
    
    # Create compressed archive with optimized compression
    case $COMPRESSION_TYPE in
        "gzip")
            tar -cf - -C /tmp "$backup_name" | gzip -$COMPRESSION_LEVEL > "$backup_file"
            ;;
        "bzip2")
            backup_file="${BACKUP_PATH}/${backup_name}.tar.bz2"
            tar -cf - -C /tmp "$backup_name" | bzip2 -$COMPRESSION_LEVEL > "$backup_file"
            ;;
        "xz")
            backup_file="${BACKUP_PATH}/${backup_name}.tar.xz"
            tar -cf - -C /tmp "$backup_name" | xz -$COMPRESSION_LEVEL -T$PARALLEL_JOBS > "$backup_file"
            ;;
        "lz4")
            backup_file="${BACKUP_PATH}/${backup_name}.tar.lz4"
            tar -cf - -C /tmp "$backup_name" | lz4 -$COMPRESSION_LEVEL > "$backup_file"
            ;;
        "7z")
            backup_file="${BACKUP_PATH}/${backup_name}.7z"
            # 7zip compression - best compression ratio
            cd /tmp
            7z a -t7z -m0=lzma2 -mx=$COMPRESSION_LEVEL -mmt=$PARALLEL_JOBS "$backup_file" "$backup_name" > /dev/null
            cd - > /dev/null
            ;;
        *)
            tar -cf - -C /tmp "$backup_name" | gzip -$COMPRESSION_LEVEL > "$backup_file"
            ;;
    esac
    
    # Clean up
    rm -rf "$temp_dir"
    
    if [ -f "$backup_file" ]; then
        print_status "Configuration backup completed: $(basename "$backup_file")"
        echo "$backup_file"
        return 0
    else
        print_error "Configuration backup failed"
        return 1
    fi
}

# Function to cleanup old backups
cleanup_old_backups() {
    print_step "Cleaning up backups older than $RETENTION_DAYS days..."
    
    local cutoff_date=$(date -d "$RETENTION_DAYS days ago" +%Y%m%d)
    local deleted_count=0
    
    # Find and delete old backup files (all compression types)
    find "$BACKUP_PATH" \( -name "*.tar.gz" -o -name "*.tar.bz2" -o -name "*.tar.xz" -o -name "*.tar.lz4" -o -name "*.tar" -o -name "*.7z" \) | while read -r file; do
        local file_date=$(basename "$file" | grep -o '[0-9]\{8\}' | head -1)
        if [ -n "$file_date" ] && [ "$file_date" -lt "$cutoff_date" ]; then
            if rm -f "$file"; then
                print_status "Deleted: $(basename "$file")"
                ((deleted_count++))
            else
                print_error "Failed to delete: $(basename "$file")"
            fi
        fi
    done
    
    print_status "Deleted $deleted_count old backup files"
}

# Function to show backup statistics
show_backup_stats() {
    print_step "Backup Statistics:"
    
    local total_size=$(du -sh "$BACKUP_PATH" 2>/dev/null | cut -f1)
    local file_count=$(find "$BACKUP_PATH" \( -name "*.tar.gz" -o -name "*.tar.bz2" -o -name "*.tar.xz" -o -name "*.tar.lz4" -o -name "*.tar" -o -name "*.7z" \) 2>/dev/null | wc -l)
    
    echo "  Total backup size: $total_size"
    echo "  Total backup files: $file_count"
    
    if [ -d "$BACKUP_PATH" ]; then
        echo "  Backup directory: $BACKUP_PATH"
        echo "  Available space: $(df -h "$BACKUP_PATH" | tail -1 | awk '{print $4}')"
    fi
}

# Main backup function
main_backup() {
    print_status "=== DCE Application Backup for Docker ==="
    print_status "Time: $(date)"
    print_status "Source: $SOURCE_PATH"
    print_status "Backup Path: $BACKUP_PATH"
    print_status "Compression: $COMPRESS ($COMPRESSION_TYPE level $COMPRESSION_LEVEL)"
    print_status "Parallel jobs: $PARALLEL_JOBS"
    print_status "Include uploads: $INCLUDE_UPLOADS"
    if [ "$INCLUDE_UPLOADS" = true ]; then
        print_status "Uploads max size: $UPLOADS_MAX_SIZE"
    fi
    
    # Check source directory
    check_source
    
    # Create backup directory
    create_backup_dir
    
    # Show current backup statistics
    show_backup_stats
    
    local backup_files=()
    local success=true
    
    # Create application backup
    backup_file=$(create_app_backup)
    if [ $? -eq 0 ]; then
        backup_files+=("$backup_file")
    else
        success=false
    fi
    
    # Create configuration backup
    backup_file=$(create_config_backup)
    if [ $? -eq 0 ]; then
        backup_files+=("$backup_file")
    else
        success=false
    fi
    
    # Create Docker backup (optional)
    if [ "$INCLUDE_DOCKER" = true ]; then
        backup_file=$(create_docker_backup)
        if [ $? -eq 0 ] && [ -n "$backup_file" ]; then
            backup_files+=("$backup_file")
        fi
    else
        print_status "Skipping Docker backup (disabled by default - use --include-docker to enable)"
    fi
    
    # Cleanup old backups if requested
    if [ "$CLEANUP" = true ]; then
        cleanup_old_backups
    fi
    
    # Show backup files
    if [ ${#backup_files[@]} -gt 0 ]; then
        print_status "Backup files created:"
        for file in "${backup_files[@]}"; do
            if [ -f "$file" ]; then
                local size=$(du -h "$file" 2>/dev/null | cut -f1)
                echo "  - $(basename "$file") ($size)"
            fi
        done
    fi
    
    # Show final statistics
    show_backup_stats
    
    # Final status
    if [ "$success" = true ]; then
        print_status "✅ Application backup completed successfully!"
        exit 0
    else
        print_error "❌ Application backup failed!"
        exit 1
    fi
}

# Run main backup function
main_backup
