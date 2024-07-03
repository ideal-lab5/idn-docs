import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/blog',
    component: ComponentCreator('/blog', 'ee9'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', 'f1a'),
    exact: true
  },
  {
    path: '/blog/blog',
    component: ComponentCreator('/blog/blog', '3a8'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '69b'),
    exact: true
  },
  {
    path: '/blog/tags/hello',
    component: ComponentCreator('/blog/tags/hello', '290'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '26d'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '91e'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '1ab'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'f07'),
            routes: [
              {
                path: '/docs/build/contracts',
                component: ComponentCreator('/docs/build/contracts', 'eb5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/build/etf_js',
                component: ComponentCreator('/docs/build/etf_js', '6ca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/build/etf_sdk',
                component: ComponentCreator('/docs/build/etf_sdk', 'bc9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/build/getting_started',
                component: ComponentCreator('/docs/build/getting_started', '1e8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/build/validator',
                component: ComponentCreator('/docs/build/validator', '747'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/build',
                component: ComponentCreator('/docs/category/build', '59e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/learn',
                component: ComponentCreator('/docs/category/learn', 'b98'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/play',
                component: ComponentCreator('/docs/category/play', 'cb3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/examples/contract_examples',
                component: ComponentCreator('/docs/examples/contract_examples', '9e7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/examples/getting_started',
                component: ComponentCreator('/docs/examples/getting_started', '938'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/examples/timelock_auction',
                component: ComponentCreator('/docs/examples/timelock_auction', 'd76'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', 'aed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/learn/crypto/delayed_transactions',
                component: ComponentCreator('/docs/learn/crypto/delayed_transactions', 'd01'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/learn/crypto/timelock_encryption',
                component: ComponentCreator('/docs/learn/crypto/timelock_encryption', 'b60'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/learn/etf-pfg',
                component: ComponentCreator('/docs/learn/etf-pfg', 'b68'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '9fe'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
