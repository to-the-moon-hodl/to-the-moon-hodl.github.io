import { render } from '@redwoodjs/testing/web'

import ArticleDetailPage from './ArticleDetailPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ArticleDetailPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ArticleDetailPage />)
    }).not.toThrow()
  })
})
