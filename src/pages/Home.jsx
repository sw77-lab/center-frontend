import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Statistic, Avatar, Divider } from 'antd';
import { UserOutlined, TeamOutlined, KeyOutlined } from '@ant-design/icons';
import authService from '../services/authService';

const { Title, Paragraph } = Typography;

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <Title level={2}>欢迎回来，{user.username || user.userAccount}</Title>
      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
              <Avatar size={80} icon={<UserOutlined />} />
              <Title level={4} style={{ marginTop: 16 }}>{user.username || user.userAccount}</Title>
              <Paragraph type="secondary">
                {user.userRole === 1 ? '管理员' : '普通用户'}
              </Paragraph>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic 
              title="账号" 
              value={user.userAccount} 
              prefix={<KeyOutlined />} 
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic 
              title="星球编号" 
              value={user.planetCode} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card style={{ marginTop: 16 }}>
        <Title level={3}>用户中心系统</Title>
        <Paragraph>
          这是一个简单的用户中心系统，提供用户注册、登录和管理功能。管理员用户可以搜索和管理所有用户。
        </Paragraph>
        <Paragraph>
          <ul>
            <li>用户注册与登录</li>
            <li>个人主页</li>
            <li>用户管理（仅限管理员）</li>
          </ul>
        </Paragraph>
      </Card>
    </div>
  );
};

export default Home;