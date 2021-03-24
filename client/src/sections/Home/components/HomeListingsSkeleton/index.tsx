import React from 'react';
import { List, Card, Skeleton } from 'antd';

import loadingCardCover from '../../assets/listing-loading-card-cover.jpg';

export const HomeListingsSkeleton = () => {
  const emptyData = new Array(4).fill({});

  return (
    <div className='home-listings-skeleton'>
      <Skeleton paragraph={{ rows: 0 }}></Skeleton>
      <List
        grid={{
          gutter: 8,
          xs: 1,
          sm: 2,
          lg: 4,
        }}
        dataSource={emptyData}
        renderItem={() => (
          <List.Item>
            <Card
              cover={
                <div
                  style={{ backgroundImage: `url(${loadingCardCover})` }}
                  className='home-listings-skeleton__card-cover-img'
                ></div>
              }
              loading
            />
          </List.Item>
        )}
      />
    </div>
  );
};
