import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home', () => {
  it('Esta renderizando un texto en la página principal', () => {
    render(<Home />);

    const heading = screen.getByText(/Bienvenido a SONIA/i);

    expect(heading).toBeInTheDocument();
  });

  it('Esta renderizando el botón con el texto y atributo correcto', () => {
    render(<Home />);
    const buttonAsLink = screen.getByRole('link', { name: /Iniciar sesión/i });

    expect(buttonAsLink).toHaveTextContent('Iniciar sesión');
    expect(buttonAsLink).toHaveAttribute('href', '/login');
  });
});