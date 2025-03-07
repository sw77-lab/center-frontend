import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Popconfirm, message, Typography, Tag } from 'antd';
import { SearchOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import authService from '../services/authService';

const { Title } = Typography;

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (username = '') => {
    setLoading(true);
    try {
      const response = await authService.searchUsers(username);
      if (response.code === 0 && response.data) {
        setUsers(response.data);
      } else {
        message.error(response.description || '获取用户列表失败');
      }
    } catch (error) {
      message.error('获取用户列表失败: ' + (error.description || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    fetchUsers(searchText);
  };

  const handleDelete = async (id) => {
    try {
      const response = await authService.deleteUser(id);
      if (response.code === 0 && response.data) {
        message.success('删除用户成功');
        fetchUsers(searchText); // 刷新用户列表
      } else {
        message.error(response.description || '删除用户失败');
      }
    } catch (error) {
      message.error('删除用户失败: ' + (error.description || '未知错误'));
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text) => text || '未设置',
    },
    {
      title: '账号',
      dataIndex: 'userAccount',
      key: 'userAccount',
    },
    {
      title: '星球编号',
      dataIndex: 'planetCode',
      key: 'planetCode',
    },
    {
      title: '角色',
      dataIndex: 'userRole',
      key: 'userRole',
      render: (role) => (
        role === 1 ? 
          <Tag color="blue">管理员</Tag> : 
          <Tag color="green">普通用户</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="确定要删除此用户吗？"
            onConfirm={() => handleDelete(record.ID)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              disabled={record.userRole === 1}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>用户管理</Title>
      
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索用户名"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<UserOutlined />}
          style={{ width: 200 }}
          onPressEnter={handleSearch}
        />
        <Button 
          type="primary" 
          icon={<SearchOutlined />} 
          onClick={handleSearch}
          loading={loading}
        >
          搜索
        </Button>
      </Space>
      
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="ID" 
        loading={loading}
        pagination={{ 
          defaultPageSize: 10, 
          showSizeChanger: true, 
          showTotal: (total) => `共 ${total} 条记录` 
        }}
      />
    </div>
  );
};

export default AdminPage;