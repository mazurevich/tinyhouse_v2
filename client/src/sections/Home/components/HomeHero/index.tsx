import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Input, Row, Typography } from 'antd';

import torontoImg from '../../assets/toronto.jpg';
import dubaiImg from '../../assets/dubai.jpg';
import losAngelesImg from '../../assets/los-angeles.jpg';
import londonImg from '../../assets/london.jpg';

const { Title } = Typography;
const { Search } = Input;

interface Props {
  onSearch: (value: string) => void;
}

export const HomeHero = ({ onSearch }: Props) => {
  return (
    <div className='home-hero'>
      <div className='home-hero__search'>
        <Title>Find a place you'll love to stay at</Title>
        <Search
          placeholder="Search 'San Fansisco'"
          size='large'
          enterButton
          className='home-hero__search-input'
          onSearch={onSearch}
        />
      </div>
      <Row gutter={12} className='home-hero__cards'>
        <Col xs={12} md={6}>
          <Link to='/listings/toronto'>
            <Card cover={<img alt='Toronto' src={torontoImg} />}>Toronto</Card>
          </Link>
        </Col>
        <Col xs={12} md={6}>
          <Link to='/listings/dubai'>
            <Card cover={<img alt='Dubai' src={dubaiImg} />}>Dubai</Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to='/listings/los%20angeles'>
            <Card cover={<img alt='Los Angeles' src={losAngelesImg} />}>
              Los Angeles
            </Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to='/listings/london'>
            <Card cover={<img alt='London' src={londonImg} />}>London</Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};
