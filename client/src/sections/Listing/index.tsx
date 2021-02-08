import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { LISTING } from '../../lib/graphql/queries';
import {
  ListingVariables,
  Listing as ListingData,
} from '../../lib/graphql/queries/Listing/__generated__/Listing';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Row, Layout } from 'antd';
import { PageSkeleton, ErrorBanner } from '../../lib/components';
import { ListingDetails, ListingBookings } from './components';

interface Props {}

interface MatchParams {
  id: string;
}

const PAGE_LIMIT = 4;

const { Content } = Layout;

export const Listing = ({
  match,
}: Props & RouteComponentProps<MatchParams>) => {
  const [bookingsPage, setBookingsPage] = useState(1);
  const { loading, data, error } = useQuery<ListingData, ListingVariables>(
    LISTING,
    {
      variables: {
        id: match.params.id,
        bookingsPage: bookingsPage,
        limit: PAGE_LIMIT,
      },
    },
  );

  if (loading) {
    return (
      <Content>
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className='listing'>
        <ErrorBanner description="This listing may not exist or we've encountered an error. Please try again soon!" />
        <PageSkeleton />
      </Content>
    );
  }

  const listing = data?.listing || null;
  const listingBookings = listing?.bookings || null;

  const listingDetailsElement = listing ? <ListingDetails listing={listing} /> : null;
  const listingBookingsElement = listingBookings ? (
    <ListingBookings
      listingBookings={listingBookings}
      setBookingsPage={setBookingsPage}
      bookingsPage={bookingsPage}
      limit={PAGE_LIMIT}
    />
  ) : null;
  return (
    <Content className='listing'>
      <Row gutter={24} justify='space-between'>
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
      </Row>
    </Content>
  );
};
