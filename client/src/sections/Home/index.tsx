import React from 'react';
import { Col, Layout, Row, Typography } from 'antd';
import { useQuery } from 'react-apollo';
import { Link, RouteComponentProps } from 'react-router-dom';
import { HomeHero, HomeListings, HomeListingsSkeleton } from './components';
import {
  Listings as ListingsData,
  ListingsVariables,
} from '../../lib/graphql/queries/Listings/__generated__/Listings';
import { displayErrorMessage } from '../../lib/utils';
import { ListingsFilter } from '../../lib/graphql/glopalTypes';

import mapBackground from './assets/map-background.jpg';
import sanFranciscoImg from './assets/san-fransisco.jpg';
import cancunImg from './assets/cancun.jpg';
import { LISTINGS } from '../../lib/graphql/queries';

const { Content } = Layout;
const { Paragraph, Title } = Typography;

export const Home = ({ history }: RouteComponentProps) => {
  const { data, error, loading } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        filter: ListingsFilter.PRICE_HIGH_TO_LOW,
        limit: 4,
        page: 0,
      },
    },
  );

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      history.push(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage('Please enter valid search');
    }
  };

  const renderListingsSection = () => {
    if (loading) {
      return <HomeListingsSkeleton />;
    }

    if (data) {
      return (
        <HomeListings
          title='Premium Listings'
          listings={data.listings.result}
        ></HomeListings>
      );
    }

    return null;
  };

  return (
    <Content
      className='home'
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
      <HomeHero onSearch={onSearch} />
      <div className='home__cta-section'>
        <Title className='home__cta-section-title'>
          Your guide for all things rental
        </Title>
        <Paragraph>
          Helping you make the best decisions in renting your last minute
          locations.
        </Paragraph>
        <Link
          to='/listings/united%20states'
          className='ant-btn ant-btn-primary ant-btn-lg home__cta-section-button'
        >
          Popular listings in the USA
        </Link>
      </div>

      {renderListingsSection()}

      <div className='home__listings'>
        <Title level={4} className='home__listings-title'>
          Listings of any kind
        </Title>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Link to='/listings/san%20fransisco'>
              <div className='home__listings-img-cover'>
                <img
                  src={sanFranciscoImg}
                  alt='San Fransisco'
                  className='home__listings-img'
                />
              </div>
            </Link>
          </Col>
          <Col xs={24} sm={12}>
            <Link to='/listings/cancun'>
              <div className='home__listings-img-cover'>
                <img
                  src={cancunImg}
                  alt='Cancun'
                  className='home__listings-img'
                />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </Content>
  );
};
