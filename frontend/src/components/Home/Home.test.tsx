import { BrowserRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { Home } from './Home'

describe('When rendering Home page', () => {
  it('Should render with the text "Todo app"', () => {
    render(<Home />, { wrapper: BrowserRouter })
    expect(screen.getByText('Todo app')).toBeInTheDocument()
  })
})
