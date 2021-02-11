import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { LISTING } from '../../lib/graphql/queries';
import { Moment } from 'moment';
import {
  ListingVariables,
  Listing as ListingData,
} from '../../lib/graphql/queries/Listing/__generated__/Listing';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Row, Layout } from 'antd';
import { PageSkeleton, ErrorBanner } from '../../lib/components';
import {
  ListingDetails,
  ListingBookings,
  ListingCreateBooking,
} from './components';

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

  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);

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
  const listingCreateBooking = listing ? (
    <ListingCreateBooking
      price={listing.price}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={setCheckInDate}
      setCheckOutDate={setCheckOutDate}
    />
  ) : null;

  const listingDetailsElement = listing ? (
    <ListingDetails listing={listing} />
  ) : null;
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
        <Col xs={24} lg={8}>
          {listingCreateBooking}
        </Col>
      </Row>
    </Content>
  );
};
