#!/bin/bash

# DCE Database Backup Script for Linux SQL Server
# Script backup database cho SQL Server Linux

# Default parameters
BACKUP_TYPE="Full"
DATABASE_NAME="webdce"
BACKUP_PATH="/home/dopt/Desktop/App/backup/BackupDB"
CONTAINER_NAME="dce_sqlserver"
COMPRESS=false
VERIFY=false
CLEANUP=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --type)
            BACKUP_TYPE="$2"
            shift 2
            ;;
        --database)
            DATABASE_NAME="$2"
            shift 2
            ;;
        --path)
            BACKUP_PATH="$2"
            shift 2
            ;;
        --container)
            CONTAINER_NAME="$2"
            shift 2
            ;;
        --compress)
            COMPRESS=true
            shift
            ;;
        --verify)
            VERIFY=true
            shift
            ;;
        --cleanup)
            CLEANUP=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --type TYPE        Backup type: Full, Differential, Log, All (default: Full)"
            echo "  --database NAME    Database name (default: webdce)"
            echo "  --path PATH        Backup path (default: /home/dopt/Desktop/App/backup/BackupDB)"
            echo "  --container NAME   Container name (default: dce_sqlserver)"
            echo "  --compress         Enable compression"
            echo "  --verify           Verify backup after creation"
            echo "  --cleanup          Clean up old backups"
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

# Function to check if Docker container is running
check_container() {
    if ! docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        print_error "Container $CONTAINER_NAME is not running"
        exit 1
    fi
    print_status "Container $CONTAINER_NAME is running"
}

# Function to create backup
create_backup() {
    local backup_type=$1
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file=""
    local backup_query=""
    
    case $backup_type in
        "Full")
            print_step "Creating full backup..."
            backup_file="${DATABASE_NAME}_FULL_${timestamp}.bak"
            backup_query="BACKUP DATABASE [${DATABASE_NAME}] TO DISK = '/var/opt/mssql/backup/${backup_file}' WITH CHECKSUM, STATS = 10"
            ;;
        "Differential")
            print_step "Creating differential backup..."
            backup_file="${DATABASE_NAME}_DIFF_${timestamp}.bak"
            backup_query="BACKUP DATABASE [${DATABASE_NAME}] TO DISK = '/var/opt/mssql/backup/${backup_file}' WITH DIFFERENTIAL, CHECKSUM, STATS = 10"
            ;;
        "Log")
            print_step "Creating transaction log backup..."
            backup_file="${DATABASE_NAME}_LOG_${timestamp}.trn"
            backup_query="BACKUP LOG [${DATABASE_NAME}] TO DISK = '/var/opt/mssql/backup/${backup_file}' WITH CHECKSUM, STATS = 10"
            ;;
        *)
            print_error "Unknown backup type: $backup_type"
            return 1
            ;;
    esac
    
    # Add compression if requested
    if [ "$COMPRESS" = true ]; then
        backup_query="${backup_query}, COMPRESSION"
    fi
    
    # Execute backup
    if docker exec $CONTAINER_NAME /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -Q "$backup_query"; then
        print_status "Backup completed: $backup_file"
        
        # Copy backup file from container to host
        if docker cp "$CONTAINER_NAME:/var/opt/mssql/backup/$backup_file" "$BACKUP_PATH/"; then
            print_status "Backup file copied to host: $BACKUP_PATH/$backup_file"
            echo "$backup_file"
            return 0
        else
            print_error "Failed to copy backup file to host"
            return 1
        fi
    else
        print_error "Backup failed for type: $backup_type"
        return 1
    fi
}

# Function to verify backup
verify_backup() {
    local backup_file=$1
    print_step "Verifying backup: $backup_file"
    
    local verify_query="RESTORE VERIFYONLY FROM DISK = '/var/opt/mssql/backup/$backup_file'"
    
    if docker exec $CONTAINER_NAME /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -Q "$verify_query"; then
        print_status "Backup verification passed: $backup_file"
        return 0
    else
        print_error "Backup verification failed: $backup_file"
        return 1
    fi
}

# Function to cleanup old backups
cleanup_old_backups() {
    local retention_days=7
    print_step "Cleaning up backups older than $retention_days days..."
    
    # Find old backup files
    local old_files=$(docker exec $CONTAINER_NAME find /var/opt/mssql/backup -name "*.bak" -o -name "*.trn" -mtime +$retention_days 2>/dev/null)
    
    if [ -n "$old_files" ]; then
        local deleted_count=0
        while IFS= read -r file; do
            if docker exec $CONTAINER_NAME rm -f "$file"; then
                print_status "Deleted: $(basename "$file")"
                ((deleted_count++))
            else
                print_error "Failed to delete: $(basename "$file")"
            fi
        done <<< "$old_files"
        print_status "Deleted $deleted_count old backup files"
    else
        print_warning "No old backups to delete"
    fi
}

# Function to get backup statistics
get_backup_stats() {
    print_step "Getting backup statistics..."
    
    local stats_query="
    SELECT 
        DB_NAME() as DatabaseName,
        SUM(size * 8 / 1024) as SizeMB,
        COUNT(*) as TotalTables
    FROM sys.database_files df
    CROSS JOIN INFORMATION_SCHEMA.TABLES t
    WHERE t.TABLE_TYPE = 'BASE TABLE'
    GROUP BY DB_NAME()
    "
    
    docker exec $CONTAINER_NAME /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -d $DATABASE_NAME -Q "$stats_query"
}

# Main backup function
main_backup() {
    print_status "=== DCE Database Backup for Docker ==="
    print_status "Time: $(date)"
    print_status "Backup Type: $BACKUP_TYPE"
    print_status "Database: $DATABASE_NAME"
    print_status "Container: $CONTAINER_NAME"
    
    # Check if container is running
    check_container
    
    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_PATH"
    
    # Get backup statistics
    get_backup_stats
    
    local backup_files=()
    local success=true
    
    case $BACKUP_TYPE in
        "Full"|"Differential"|"Log")
            backup_file=$(create_backup $BACKUP_TYPE)
            if [ $? -eq 0 ]; then
                backup_files+=("$backup_file")
            else
                success=false
            fi
            ;;
        "All")
            # Create all types of backups
            for type in "Full" "Differential" "Log"; do
                backup_file=$(create_backup $type)
                if [ $? -eq 0 ]; then
                    backup_files+=("$backup_file")
                else
                    success=false
                fi
            done
            ;;
        *)
            print_error "Invalid backup type: $BACKUP_TYPE"
            exit 1
            ;;
    esac
    
    # Verify backups if requested
    if [ "$VERIFY" = true ] && [ "$success" = true ]; then
        for backup_file in "${backup_files[@]}"; do
            if ! verify_backup "$backup_file"; then
                success=false
            fi
        done
    fi
    
    # Cleanup old backups if requested
    if [ "$CLEANUP" = true ]; then
        cleanup_old_backups
    fi
    
    # Show backup files
    if [ ${#backup_files[@]} -gt 0 ]; then
        print_status "Backup files created:"
        for file in "${backup_files[@]}"; do
            echo "  - $file"
        done
    fi
    
    # Final status
    if [ "$success" = true ]; then
        print_status "✅ Database backup completed successfully!"
        exit 0
    else
        print_error "❌ Database backup failed!"
        exit 1
    fi
}

# Run main backup function
main_backup
