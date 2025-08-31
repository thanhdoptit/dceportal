/**
 * Table Components
 * 
 * A collection of reusable table components for displaying data in a consistent and user-friendly way.
 * These components are built on top of Ant Design and styled with Tailwind CSS.
 */

export { default as Table } from './Table';
export { default as TableHeader } from './TableHeader';
export { default as TableBody } from './TableBody';
export { default as TableRow } from './TableRow';
export { default as TableCell } from './TableCell';
export { default as TableHeaderCell } from './TableHeaderCell';
export { default as TablePagination } from './TablePagination';
export { default as TableSearch } from './TableSearch';
export { default as TableLoading } from './TableLoading';
export { default as TableEmpty } from './TableEmpty';
export { default as TableError } from './TableError';

/**
 * Component Usage Examples:
 * 
 * Basic Table:
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHeaderCell>Name</TableHeaderCell>
 *       <TableHeaderCell>Age</TableHeaderCell>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>John</TableCell>
 *       <TableCell>25</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * 
 * With Loading State:
 * <TableLoading rows={5} columns={3} />
 * 
 * With Empty State:
 * <TableEmpty description="No data available" />
 * 
 * With Error State:
 * <TableError onRetry={() => fetchData()} />
 * 
 * With Search:
 * <TableSearch value={searchText} onChange={handleSearch} />
 * 
 * With Pagination:
 * <TablePagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={handlePageChange}
 * />
 */ 