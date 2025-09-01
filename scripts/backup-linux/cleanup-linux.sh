#!/bin/bash

# DCE System - Cleanup Script for Linux
# Script cleanup cho Linux environment

# Default parameters
CLEANUP_TYPE="All"
RETENTION_DAYS=7
DRY_RUN=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --type)
            CLEANUP_TYPE="$2"
            shift 2
            ;;
        --retention)
            RETENTION_DAYS="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --type TYPE        Cleanup type: Database, Application, Linux, All (default: All)"
            echo "  --retention DAYS   Retention days (default: 7)"
            echo "  --dry-run          Show what would be deleted without actually deleting"
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
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  DCE System - Docker Cleanup${NC}"
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

# Function to cleanup database backups
cleanup_database_backups() {
    print_step "Cleaning up database backups older than $RETENTION_DAYS days..."
    
    local backup_path="/home/dopt/Desktop/App/backup/BackupDB"
    local cutoff_date=$(date -d "$RETENTION_DAYS days ago" +%Y%m%d)
    local deleted_count=0
    local total_size=0
    
    if [ ! -d "$backup_path" ]; then
        print_warning "Database backup directory not found: $backup_path"
        return 0
    fi
    
    # Find old backup files
    while IFS= read -r -d '' file; do
        local file_date=$(basename "$file" | grep -o '[0-9]\{8\}' | head -1)
        if [ -n "$file_date" ] && [ "$file_date" -lt "$cutoff_date" ]; then
            local file_size=$(du -h "$file" 2>/dev/null | cut -f1)
            if [ "$DRY_RUN" = true ]; then
                print_warning "Would delete: $(basename "$file") ($file_size)"
            else
                if rm -f "$file"; then
                    print_status "Deleted: $(basename "$file") ($file_size)"
                    ((deleted_count++))
                else
                    print_error "Failed to delete: $(basename "$file")"
                fi
            fi
        fi
    done < <(find "$backup_path" -name "*.bak" -o -name "*.trn" -print0)
    
    if [ "$DRY_RUN" = true ]; then
        print_warning "Dry run: Would delete $deleted_count database backup files"
    else
        print_status "Deleted $deleted_count database backup files"
    fi
}

# Function to cleanup application backups
cleanup_application_backups() {
    print_step "Cleaning up application backups older than $RETENTION_DAYS days..."
    
    local backup_path="/home/dopt/Desktop/App/backup/BackupApp"
    local cutoff_date=$(date -d "$RETENTION_DAYS days ago" +%Y%m%d)
    local deleted_count=0
    
    if [ ! -d "$backup_path" ]; then
        print_warning "Application backup directory not found: $backup_path"
        return 0
    fi
    
    # Find old backup files
    while IFS= read -r -d '' file; do
        local file_date=$(basename "$file" | grep -o '[0-9]\{8\}' | head -1)
        if [ -n "$file_date" ] && [ "$file_date" -lt "$cutoff_date" ]; then
            local file_size=$(du -h "$file" 2>/dev/null | cut -f1)
            if [ "$DRY_RUN" = true ]; then
                print_warning "Would delete: $(basename "$file") ($file_size)"
            else
                if rm -f "$file"; then
                    print_status "Deleted: $(basename "$file") ($file_size)"
                    ((deleted_count++))
                else
                    print_error "Failed to delete: $(basename "$file")"
                fi
            fi
        fi
    done < <(find "$backup_path" -name "*.tar.gz" -o -name "*.tar" -print0)
    
    if [ "$DRY_RUN" = true ]; then
        print_warning "Dry run: Would delete $deleted_count application backup files"
    else
        print_status "Deleted $deleted_count application backup files"
    fi
}

# Function to cleanup Linux resources
cleanup_docker_resources() {
    print_step "Cleaning up Linux resources..."
    
    # Cleanup unused containers
    local stopped_containers=$(docker ps -a --filter "status=exited" --filter "status=created" -q)
    if [ -n "$stopped_containers" ]; then
        if [ "$DRY_RUN" = true ]; then
            print_warning "Would remove stopped containers:"
            docker ps -a --filter "status=exited" --filter "status=created" --format "table {{.Names}}\t{{.Status}}"
        else
            if docker container prune -f; then
                print_status "Removed stopped containers"
            else
                print_error "Failed to remove stopped containers"
            fi
        fi
    else
        print_status "No stopped containers to remove"
    fi
    
    # Cleanup unused images
    local dangling_images=$(docker images -f "dangling=true" -q)
    if [ -n "$dangling_images" ]; then
        if [ "$DRY_RUN" = true ]; then
            print_warning "Would remove dangling images:"
            docker images -f "dangling=true" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
        else
            if docker image prune -f; then
                print_status "Removed dangling images"
            else
                print_error "Failed to remove dangling images"
            fi
        fi
    else
        print_status "No dangling images to remove"
    fi
    
    # Cleanup unused volumes
    local unused_volumes=$(docker volume ls -q -f "dangling=true")
    if [ -n "$unused_volumes" ]; then
        if [ "$DRY_RUN" = true ]; then
            print_warning "Would remove unused volumes:"
            docker volume ls -f "dangling=true" --format "table {{.Name}}\t{{.Driver}}"
        else
            if docker volume prune -f; then
                print_status "Removed unused volumes"
            else
                print_error "Failed to remove unused volumes"
            fi
        fi
    else
        print_status "No unused volumes to remove"
    fi
    
    # Cleanup unused networks
    local unused_networks=$(docker network ls -q -f "type=custom")
    if [ -n "$unused_networks" ]; then
        if [ "$DRY_RUN" = true ]; then
            print_warning "Would remove unused networks:"
            docker network ls -f "type=custom" --format "table {{.Name}}\t{{.Driver}}"
        else
            if docker network prune -f; then
                print_status "Removed unused networks"
            else
                print_error "Failed to remove unused networks"
            fi
        fi
    else
        print_status "No unused networks to remove"
    fi
}

# Function to cleanup backup logs
cleanup_backup_logs() {
    print_step "Cleaning up backup logs older than $RETENTION_DAYS days..."
    
    local logs_path="/home/dopt/Desktop/App/backup/backupLogs"
    local cutoff_date=$(date -d "$RETENTION_DAYS days ago" +%Y%m%d)
    local deleted_count=0
    
    if [ ! -d "$logs_path" ]; then
        print_warning "Backup logs directory not found: $logs_path"
        return 0
    fi
    
    # Find old log files
    while IFS= read -r -d '' file; do
        local file_date=$(basename "$file" | grep -o '[0-9]\{8\}' | head -1)
        if [ -n "$file_date" ] && [ "$file_date" -lt "$cutoff_date" ]; then
            if [ "$DRY_RUN" = true ]; then
                print_warning "Would delete: $(basename "$file")"
            else
                if rm -f "$file"; then
                    print_status "Deleted: $(basename "$file")"
                    ((deleted_count++))
                else
                    print_error "Failed to delete: $(basename "$file")"
                fi
            fi
        fi
    done < <(find "$logs_path" -name "backup_summary_*.txt" -print0)
    
    if [ "$DRY_RUN" = true ]; then
        print_warning "Dry run: Would delete $deleted_count backup log files"
    else
        print_status "Deleted $deleted_count backup log files"
    fi
}

# Function to show cleanup statistics
show_cleanup_stats() {
    print_step "Cleanup Statistics:"
    
    # Database backup statistics
    if [ -d "/home/dopt/Desktop/App/backup/BackupDB" ]; then
        local db_size=$(du -sh "/home/dopt/Desktop/App/backup/BackupDB" 2>/dev/null | cut -f1)
        local db_count=$(find "/home/dopt/Desktop/App/backup/BackupDB" -name "*.bak" -o -name "*.trn" 2>/dev/null | wc -l)
        echo "  Database backups: $db_count files ($db_size)"
    fi
    
    # Application backup statistics
    if [ -d "/home/dopt/Desktop/App/backup/BackupApp" ]; then
        local app_size=$(du -sh "/home/dopt/Desktop/App/backup/BackupApp" 2>/dev/null | cut -f1)
        local app_count=$(find "/home/dopt/Desktop/App/backup/BackupApp" -name "*.tar.gz" -o -name "*.tar" 2>/dev/null | wc -l)
        echo "  Application backups: $app_count files ($app_size)"
    fi
    
    # Docker statistics
    local container_count=$(docker ps -q | wc -l)
    local image_count=$(docker images -q | wc -l)
    local volume_count=$(docker volume ls -q | wc -l)
    echo "  Docker containers: $container_count running"
    echo "  Docker images: $image_count total"
    echo "  Docker volumes: $volume_count total"
    
    # Disk usage
    local total_size=$(du -sh "/home/dopt/Desktop/App/backup" 2>/dev/null | cut -f1)
    local available_space=$(df -h /home/dopt/Desktop/App | tail -1 | awk '{print $4}')
    echo "  Total backup size: $total_size"
    echo "  Available space: $available_space"
}

# Main cleanup function
main_cleanup() {
    print_header
    print_status "Time: $(date)"
    print_status "Cleanup Type: $CLEANUP_TYPE"
    print_status "Retention Days: $RETENTION_DAYS"
    print_status "Dry Run: $DRY_RUN"
    
    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY RUN MODE - No files will be actually deleted"
    fi
    
    # Show initial statistics
    show_cleanup_stats
    
    # Run cleanup based on type
    case $CLEANUP_TYPE in
        "Database")
            cleanup_database_backups
            ;;
        "Application")
            cleanup_application_backups
            ;;
        "Linux")
            cleanup_docker_resources
            ;;
        "All")
            cleanup_database_backups
            cleanup_application_backups
            cleanup_docker_resources
            cleanup_backup_logs
            ;;
        *)
            print_error "Invalid cleanup type: $CLEANUP_TYPE"
            exit 1
            ;;
    esac
    
    # Show final statistics
    echo ""
    show_cleanup_stats
    
    # Final status
    if [ "$DRY_RUN" = true ]; then
        print_warning "Dry run completed. Use without --dry-run to actually perform cleanup."
    else
        print_status "✅ Cleanup completed successfully!"
    fi
}

# Run main cleanup function
main_cleanup
