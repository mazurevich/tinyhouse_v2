import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import { Layout, List, Typography, Affix } from 'antd';
import { LISTINGS } from '../../lib/graphql/queries';
import {
  Listings as ListingsData,
  ListingsVariables,
} from '../../lib/graphql/queries/Listings/__generated__/Listings';
import { ListingsFilter } from '../../lib/graphql/glopalTypes';
import { ErrorBanner, ListingCard } from '../../lib/components';
import {
  ListingsFilters,
  ListingsPagination,
  ListingsSkeleton,
} from './components';
import { displayErrorMessage } from '../../lib/utils';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const PAGE_LIMIT = 8;

interface MatchParams {
  location: string;
}

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
  const [filter, setFilter] = useState<ListingsFilter>(
    ListingsFilter.PRICE_LOW_TO_HIGH,
  );
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        location: match.params.location,
        filter,
        limit: PAGE_LIMIT,
        page,
      },
    },
  );

  if (loading) {
    return (
      <Content className='listings'>
        <ListingsSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className='listings'>
        <ErrorBanner description="We either couldn't find anything matching your search or have encountered error. If you're searching for a unique location, try searching again with more common keywords" />
        <ListingsSkeleton />
      </Content>
    );
  }

  const listings = data?.listings || null;
  const listingsRegion = listings?.region || null;
  const total = listings?.total || 0;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <div>
        <Affix offsetTop={64}>
          <ListingsPagination
            page={page}
            total={total}
            setPage={setPage}
            limit={PAGE_LIMIT}
          />
          <ListingsFilters filter={filter} setFilter={setFilter} />
        </Affix>
        <List
          grid={{
            gutter: 8,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={listings.result}
          renderItem={(listing) => (
            <List.Item>
              <ListingCard listing={listing} />
            </List.Item>
          )}
        />
      </div>
    ) : (
      <div>
        <Paragraph>
          It appears that no listings have yet been created for {'  '}
          <Text mark>"{listingsRegion}"</Text>
        </Paragraph>
        <Paragraph>
          Be the first person to create a{' '}
          <Link to='/host'>listing in this area</Link>!
        </Paragraph>
      </div>
    );

  const listingsRegionElement = listingsRegion ? (
    <Title level={3} className='listings__title'>
      Results for "{listingsRegion}"
    </Title>
  ) : null;
  return (
    <Content className='listings'>
      {listingsRegionElement}
      {listingsSectionElement}
    </Content>
  );
};
