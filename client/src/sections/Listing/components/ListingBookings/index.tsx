import React from 'react';
import { Avatar, Divider, List, Typography } from 'antd';
import { Listing as ListingData } from '../../../../lib/graphql/queries/Listing/__generated__/Listing';
import { Link } from 'react-router-dom';

interface Props {
  listingBookings: ListingData['listing']['bookings'];
  bookingsPage: number;
  limit: number;
  setBookingsPage: (page: number) => void;
}

const { Text, Title } = Typography;

export const ListingBookings = ({
  listingBookings,
  bookingsPage,
  limit,
  setBookingsPage,
}: Props) => {
  const total = listingBookings?.total || null;
  const result = listingBookings?.result || null;

  const listingBookingElement =
    // total && result ? (
    listingBookings ? (
      <List
        grid={{
          gutter: 8,
          xs: 1,
          sm: 2,
          lg: 3,
        }}
        dataSource={result ? result : undefined}
        locale={{ emptyText: 'No bookings have been made yet!' }}
        pagination={{
          current: bookingsPage,
          total: total ? total : undefined,
          defaultPageSize: limit,
          hideOnSinglePage: true,
          showLessItems: true,
          onChange: (page: number) => setBookingsPage(page),
        }}
        renderItem={(listingBooking) => {
          const bookingHistory = (
            <div className='listing-bookings__history'>
              <div>
                Check In: <Text strong>{listingBooking.checkIn}</Text>
              </div>
              <div>
                Check Out: <Text strong>{listingBooking.checkOut}</Text>
              </div>
            </div>
          );
          return (
            <List.Item>
              {bookingHistory}
              <Link to={`/user/${listingBooking.tenant.id}`}>
                <Avatar
                  src={listingBooking.tenant.avatar}
                  size={64}
                  shape='square'
                />
              </Link>
            </List.Item>
          );
        }}
      />
    ) : null;

  return listingBookingElement ? (
    <div className='listing-bookings'>
      <Divider />
      <div className='listing-bookings__section'>
        <Title level={4}>Listings</Title>
        {listingBookingElement}
      </div>
    </div>
  ) : null;
};
