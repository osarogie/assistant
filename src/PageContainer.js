import { SimpleLink } from './components/link/SimpleLink'
import React from 'react'
import { Layout, Menu } from 'antd'
import { UserControls } from './components/user/UserControls'
import { useRouter } from 'next/dist/client/router'

const { Header, Content, Footer } = Layout

const links = [
  { href: '/goals', label: 'Goals' },
  { href: '/subscriptions', label: 'Subscriptions' },
  { href: '/shopping-list', label: 'Shopping List' }
]

export function PageContainer({ children }) {
  const router = useRouter()
  console.log(router)

  const padding = '0 23px'

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[router.route]}
          style={{ lineHeight: '64px' }}
        >
          {links.map(({ href, label }) => (
            <Menu.Item key={href}>
              <SimpleLink href={href}>{label}</SimpleLink>
            </Menu.Item>
          ))}
        </Menu>
      </Header>
      <UserControls />
      <Content style={{ padding }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        &copy; {new Date().getFullYear()} Created by Emmanuel Nosakhare{' '}
        <a
          href="//osarogie.com"
          rel="noopener noreferrer"
          title="Emmanuel Nosakhare - Software Engineer"
          target="_blank"
        >
          www.osarogie.com
        </a>
      </Footer>
    </Layout>
  )
}
