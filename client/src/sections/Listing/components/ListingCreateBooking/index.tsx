import React from 'react';
import { Button, Card, DatePicker, Divider, Typography } from 'antd';
import { displayErrorMessage, formatListingPrice } from '../../../../lib/utils';
import moment, { Moment } from 'moment';

const { Paragraph, Title } = Typography;

interface Props {
  price: number;
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkOutDate: Moment | null) => void;
}

export const ListingCreateBooking = ({
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}: Props) => {
  const verifyAndSetCheckOutDate = (selectedCheckoutDate: Moment | null) => {
    if (
      selectedCheckoutDate &&
      checkInDate &&
      selectedCheckoutDate?.isBefore(checkInDate)
    ) {
      return displayErrorMessage(
        'You cannot boot date of check out to be prior to check in!',
      );
    }

    return setCheckOutDate(selectedCheckoutDate);
  };

  const setCheckInDisabledDate = (currentDate?: Moment) => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf('day'));

      const dateIsAfterCheckOutDay =
        !!checkOutDate && currentDate.isAfter(checkOutDate?.startOf('day'));

      return dateIsBeforeEndOfDay || dateIsAfterCheckOutDay;
    }
    return false;
  };

  const setCheckOutDisabledDate = (currentDate?: Moment) => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf('day'));

      const dateIsBeforeCheckInDate =
        currentDate.isBefore(checkInDate?.endOf('day')) || false;

      return dateIsBeforeEndOfDay || dateIsBeforeCheckInDate;
    }

    return false;
  };
  return (
    <div className='listing-booking'>
      <Card className='listing-booking__card'>
        <div>
          <Paragraph>
            <Title level={2} className='listing-booking__card-title'>
              {formatListingPrice(price)}
              <span>/day</span>
            </Title>
          </Paragraph>
          <Divider />
          <div className='listing-booking__card-date-picker'>
            <Paragraph strong={true}>Check In</Paragraph>
            <DatePicker
              value={checkInDate}
              onChange={setCheckInDate}
              disabledDate={setCheckInDisabledDate}
              format='YYYY/MM/DD'
              showToday={false}
            />
          </div>
          <div className='listing-booking__card-date-picker'>
            <Paragraph strong>Check Out</Paragraph>
            <DatePicker
              value={checkOutDate}
              onChange={(date) => verifyAndSetCheckOutDate(date)}
              format='YYYY/MM/DD'
              disabledDate={setCheckOutDisabledDate}
              disabled={!checkInDate}
              showToday={false}
            />
          </div>
        </div>
        <Divider />
        <Button
          size='large'
          type='primary'
          className='listing-booking__card-cta'
          disabled={!checkInDate || !checkOutDate}
        >
          Request to Book!
        </Button>
      </Card>
    </div>
  );
};
