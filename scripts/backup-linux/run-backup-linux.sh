#!/bin/bash

# DCE System - Main Backup Script for Linux
# Script chính để chạy tất cả backup cho Linux environment

# Default parameters - Tối ưu cho backup hàng ngày
BACKUP_TYPE="All"
DATABASE_BACKUP_TYPE="Full"
VERIFY=true
COMPRESS=true
CLEANUP=true
COMPRESSION_LEVEL=5
COMPRESSION_TYPE="7z"
PARALLEL_JOBS=8
INCLUDE_UPLOADS=true
UPLOADS_MAX_SIZE="2GB"
INCLUDE_DOCKER=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --type)
            BACKUP_TYPE="$2"
            shift 2
            ;;
        --db-type)
            DATABASE_BACKUP_TYPE="$2"
            shift 2
            ;;
        --verify)
            VERIFY=true
            shift
            ;;
        --no-verify)
            VERIFY=false
            shift
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
        --no-cleanup)
            CLEANUP=false
            shift
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
        --no-include-uploads)
            INCLUDE_UPLOADS=false
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
            echo "  --type TYPE        Backup type: Database, Application, All (default: All)"
            echo "  --db-type TYPE     Database backup type: Full, Differential, Log, All (default: Full)"
            echo "  --verify           Verify database backup after creation (default: true)"
            echo "  --no-verify        Disable database backup verification"
            echo "  --compress         Enable compression (default: true)"
            echo "  --no-compress      Disable compression"
            echo "  --cleanup          Clean up old backups (default: true)"
            echo "  --no-cleanup       Disable cleanup"
            echo "  --compression-level LEVEL Compression level 1-9 (default: 5)"
            echo "  --compression-type TYPE   gzip, bzip2, xz, lz4, 7z (default: 7z)"
            echo "  --parallel JOBS    Number of parallel jobs (default: 8)"
            echo "  --include-uploads  Include uploads folder in backup (default: true)"
            echo "  --no-include-uploads Disable uploads folder backup"
            echo "  --uploads-max-size SIZE Max uploads size (default: 2GB)"
            echo "  --include-docker   Include Docker image backup (default: false)"
            echo "  --no-include-docker Disable Docker image backup"
            echo "  --help             Show this help"
            echo ""
            echo "Default Configuration (Optimized for Daily Backup):"
            echo "  - Full database + application backup"
            echo "  - 7z compression level 5 (balanced speed/size)"
            echo "  - 8 parallel jobs"
            echo "  - Include uploads folder (2GB max)"
            echo "  - Verify database backup"
            echo "  - Auto cleanup old backups"
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
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  DCE System - Linux Backup${NC}"
    echo -e "${BLUE}================================${NC}"
}

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

# Function to check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running or not accessible"
        exit 1
    fi
    
    # Check if backup scripts exist
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local db_script="${script_dir}/database-backup-linux.sh"
    local app_script="${script_dir}/application-backup-linux.sh"
    
    if [ ! -f "$db_script" ]; then
        print_error "Database backup script not found: $db_script"
        exit 1
    fi
    
    if [ ! -f "$app_script" ]; then
        print_error "Application backup script not found: $app_script"
        exit 1
    fi
    
    # Make scripts executable
    chmod +x "$db_script" "$app_script"
    
    print_status "Prerequisites check passed"
}

# Function to run database backup
run_database_backup() {
    print_step "1. Running Database Backup..."
    print_status "Database Backup Type: $DATABASE_BACKUP_TYPE"
    
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local db_script="${script_dir}/database-backup-linux.sh"
    
    local verify_flag=""
    if [ "$VERIFY" = true ]; then
        verify_flag="--verify"
    fi
    
    local cleanup_flag=""
    if [ "$CLEANUP" = true ]; then
        cleanup_flag="--cleanup"
    fi
    
    if "$db_script" --type "$DATABASE_BACKUP_TYPE" $verify_flag $cleanup_flag; then
        print_status "✅ Database backup completed successfully"
        return 0
    else
        print_error "❌ Database backup failed"
        return 1
    fi
}

# Function to run application backup
run_application_backup() {
    print_step "2. Running Application Backup..."
    
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local app_script="${script_dir}/application-backup-linux.sh"
    
    local compress_flag=""
    if [ "$COMPRESS" = true ]; then
        compress_flag="--compress"
    else
        compress_flag="--no-compress"
    fi
    
    local cleanup_flag=""
    if [ "$CLEANUP" = true ]; then
        cleanup_flag="--cleanup"
    fi
    
    local compression_level_flag=""
    if [ -n "$COMPRESSION_LEVEL" ]; then
        compression_level_flag="--compression-level $COMPRESSION_LEVEL"
    fi
    
    local compression_type_flag=""
    if [ -n "$COMPRESSION_TYPE" ]; then
        compression_type_flag="--compression-type $COMPRESSION_TYPE"
    fi
    
    local parallel_flag=""
    if [ -n "$PARALLEL_JOBS" ]; then
        parallel_flag="--parallel $PARALLEL_JOBS"
    fi
    
    local uploads_flag=""
    if [ "$INCLUDE_UPLOADS" = true ]; then
        uploads_flag="--include-uploads"
    else
        uploads_flag="--no-include-uploads"
    fi
    
    local uploads_size_flag=""
    if [ -n "$UPLOADS_MAX_SIZE" ]; then
        uploads_size_flag="--uploads-max-size $UPLOADS_MAX_SIZE"
    fi
    
    local docker_flag=""
    if [ "$INCLUDE_DOCKER" = true ]; then
        docker_flag="--include-docker"
    else
        docker_flag="--no-include-docker"
    fi
    
    if "$app_script" $compress_flag $cleanup_flag $compression_level_flag $compression_type_flag $parallel_flag $uploads_flag $uploads_size_flag $docker_flag; then
        print_status "✅ Application backup completed successfully"
        return 0
    else
        print_error "❌ Application backup failed"
        return 1
    fi
}

# Function to create backup summary
create_backup_summary() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local summary_file="/home/dopt/Desktop/App/backup/BackupLogs/backup_summary_${timestamp}.txt"
    
    print_step "Creating backup summary..."
    
    # Create backup directory if it doesn't exist
    mkdir -p "/home/dopt/Desktop/App/backup/BackupLogs"
    
    cat > "$summary_file" << EOF
DCE System Backup Summary
=========================
Timestamp: $(date)
Backup Type: $BACKUP_TYPE
Database Backup Type: $DATABASE_BACKUP_TYPE
Verify: $VERIFY
Compress: $COMPRESS
Cleanup: $CLEANUP
Compression: $COMPRESSION_TYPE level $COMPRESSION_LEVEL
Parallel Jobs: $PARALLEL_JOBS
Include Uploads: $INCLUDE_UPLOADS$(if [ "$INCLUDE_UPLOADS" = true ]; then echo "
Uploads Max Size: $UPLOADS_MAX_SIZE"; fi)

System Information:
- Hostname: $(hostname)
- OS: $(lsb_release -d | cut -f2)
- Docker Version: $(docker --version)
- Available Disk Space: $(df -h /home/dopt/Desktop/App | tail -1 | awk '{print $4}')

Backup Results:
EOF
    
    # Add database backup results
    if [ "$BACKUP_TYPE" = "Database" ] || [ "$BACKUP_TYPE" = "All" ]; then
        echo "Database Backup: $([ $? -eq 0 ] && echo "SUCCESS" || echo "FAILED")" >> "$summary_file"
    fi
    
    # Add application backup results
    if [ "$BACKUP_TYPE" = "Application" ] || [ "$BACKUP_TYPE" = "All" ]; then
        echo "Application Backup: $([ $? -eq 0 ] && echo "SUCCESS" || echo "FAILED")" >> "$summary_file"
    fi
    
    # Add backup file information
    echo "" >> "$summary_file"
    echo "Backup Files:" >> "$summary_file"
    
    # Database backup files
    if [ -d "/home/dopt/Desktop/App/backup/BackupDB" ]; then
        echo "Database backups:" >> "$summary_file"
        # Use a temporary file to avoid argument list too long
        local temp_file=$(mktemp)
        find "/home/dopt/Desktop/App/backup/BackupDB" -name "*.bak" -o -name "*.trn" > "$temp_file"
        while read -r file; do
            if [ -f "$file" ]; then
                local size=$(du -h "$file" 2>/dev/null | cut -f1)
                echo "  - $(basename "$file") ($size)" >> "$summary_file"
            fi
        done < "$temp_file"
        rm -f "$temp_file"
    fi
    
    # Application backup files (all compression types)
    if [ -d "/home/dopt/Desktop/App/backup/BackupApp" ]; then
        echo "Application backups:" >> "$summary_file"
        # Use a temporary file to avoid argument list too long
        local temp_file=$(mktemp)
        find "/home/dopt/Desktop/App/backup/BackupApp" \( -name "*.tar.gz" -o -name "*.tar.bz2" -o -name "*.tar.xz" -o -name "*.tar.lz4" -o -name "*.tar" -o -name "*.7z" \) > "$temp_file"
        while read -r file; do
            if [ -f "$file" ]; then
                local size=$(du -h "$file" 2>/dev/null | cut -f1)
                echo "  - $(basename "$file") ($size)" >> "$summary_file"
            fi
        done < "$temp_file"
        rm -f "$temp_file"
    fi
    
    print_status "Backup summary saved to: $summary_file"
}

# Function to show final statistics
show_final_stats() {
    print_step "Final Backup Statistics:"
    
    # Database backup statistics
    if [ -d "/home/dopt/Desktop/App/backup/BackupDB" ]; then
        local db_size=$(du -sh "/home/dopt/Desktop/App/backup/BackupDB" 2>/dev/null | cut -f1)
        local db_count=$(find "/home/dopt/Desktop/App/backup/BackupDB" -name "*.bak" -o -name "*.trn" 2>/dev/null | wc -l)
        echo "  Database backups: $db_count files ($db_size)"
    fi
    
    # Application backup statistics
    if [ -d "/home/dopt/Desktop/App/backup/BackupApp" ]; then
        local app_size=$(du -sh "/home/dopt/Desktop/App/backup/BackupApp" 2>/dev/null | cut -f1)
        local app_count=$(find "/home/dopt/Desktop/App/backup/BackupApp" \( -name "*.tar.gz" -o -name "*.tar.bz2" -o -name "*.tar.xz" -o -name "*.tar.lz4" -o -name "*.tar" -o -name "*.7z" \) 2>/dev/null | wc -l)
        echo "  Application backups: $app_count files ($app_size)"
    fi
    
    # Total disk usage
    local total_size=$(du -sh "/home/dopt/Desktop/App/backup" 2>/dev/null | cut -f1)
    echo "  Total backup size: $total_size"
    
    # Available space
    local available_space=$(df -h /home/dopt/Desktop/App | tail -1 | awk '{print $4}')
    echo "  Available space: $available_space"
}

# Main backup function
main_backup() {
    print_header
    print_status "Time: $(date)"
    print_status "Backup Type: $BACKUP_TYPE"
    print_status "Database Backup Type: $DATABASE_BACKUP_TYPE"
    print_status "Verify: $VERIFY"
    print_status "Compress: $COMPRESS"
    print_status "Cleanup: $CLEANUP"
    print_status "Compression: $COMPRESSION_TYPE level $COMPRESSION_LEVEL"
    print_status "Parallel jobs: $PARALLEL_JOBS"
    print_status "Include uploads: $INCLUDE_UPLOADS"
    if [ "$INCLUDE_UPLOADS" = true ]; then
        print_status "Uploads max size: $UPLOADS_MAX_SIZE"
    fi
    
    # Check prerequisites
    check_prerequisites
    
    local overall_success=true
    local db_success=true
    local app_success=true
    
    # Run database backup
    if [ "$BACKUP_TYPE" = "Database" ] || [ "$BACKUP_TYPE" = "All" ]; then
        if ! run_database_backup; then
            db_success=false
            overall_success=false
        fi
    fi
    
    # Run application backup
    if [ "$BACKUP_TYPE" = "Application" ] || [ "$BACKUP_TYPE" = "All" ]; then
        if ! run_application_backup; then
            app_success=false
            overall_success=false
        fi
    fi
    
    # Create backup summary
    create_backup_summary
    
    # Show final statistics
    show_final_stats
    
    # Final status
    echo ""
    if [ "$overall_success" = true ]; then
        print_status "🎉 All backups completed successfully!"
        print_status "Backup summary created with detailed information"
        exit 0
    else
        print_warning "⚠️ Some backups failed. Check the summary for details."
        if [ "$db_success" = false ]; then
            print_error "Database backup failed"
        fi
        if [ "$app_success" = false ]; then
            print_error "Application backup failed"
        fi
        exit 1
    fi
}

# Run main backup function
main_backup
