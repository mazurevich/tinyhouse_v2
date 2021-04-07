import React from 'react';
import { Pagination } from 'antd';

interface Props {
  total: number;
  page: number;
  limit: number;
  setPage: (page: number) => void;
}

export const ListingsPagination = ({ page, limit, setPage, total }: Props) => {
  return (
    <Pagination
      current={page}
      total={total}
      defaultPageSize={limit}
      hideOnSinglePage
      showLessItems
      onChange={(page) => setPage(page)}
      className='listings-pagination'
    />
  );
};
