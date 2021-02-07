import React from 'react';
import { List, Typography } from 'antd';
import { ListingCard } from '../../../../lib/components';
import { User } from '../../../../lib/graphql/queries/User/__generated__/User';

interface Props {
  userBookings: User['user']['bookings'];
  bookingsPage: number;
  limit: number;
  setBookingsPage: (page: number) => void;
}

const { Paragraph, Text, Title } = Typography;

export const UserBookings = ({
  userBookings,
  bookingsPage,
  limit,
  setBookingsPage,
}: Props) => {
  const total = userBookings?.total || null;
  const result = userBookings?.result || null;

  const userBookingsList =
    // total && result ? (
    userBookings ? (
      <List
        grid={{
          gutter: 8,
          xs: 1,
          sm: 2,
          lg: 4,
        }}
        dataSource={result ? result : undefined}
        locale={{ emptyText: "You haven't make any booking" }}
        pagination={{
          position: 'top',
          current: bookingsPage,
          total: total ? total : undefined,
          defaultPageSize: limit,
          hideOnSinglePage: true,
          showLessItems: true,
          onChange: (page: number) => setBookingsPage(page),
        }}
        renderItem={(userBooking) => {
          const bookingHistory = (
            <div className="user-bookings__booking-history">
              <div>
                Check In: <Text strong>{userBooking.checkIn}</Text>
              </div>
              <div>
                Check Out: <Text strong>{userBooking.checkOut}</Text>
              </div>
            </div>
          );
          return (
            <List.Item>
              {bookingHistory}
              <ListingCard listing={userBooking.listing} />
            </List.Item>
          );
        }}
      />
    ) : null;

  return userBookingsList ? (
    <div className="user-bookings">
      <Title level={4} className="user-bookings__title">
        Listings
      </Title>
      <Paragraph className="user-bookings__description">
        This section highlights the bookings you've made, and the
        check-in/check-out dates associated with said bookings.
      </Paragraph>
      {userBookingsList}
    </div>
  ) : null;
};
