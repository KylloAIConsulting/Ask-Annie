import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import Layout from '../components/Layout/Layout';

/**
 * T1.2 — Layout component tests.
 *
 * Covers structure, skip-link presence, landmark correctness, and
 * axe-core accessibility compliance.
 */

const TestContent = (
  <>
    <h1>Test page heading</h1>
    <p>Test page content for layout verification.</p>
  </>
);

describe('Layout', () => {
  describe('structure', () => {
    it('renders children without crashing', () => {
      render(<Layout>{TestContent}</Layout>);
      expect(screen.getByText('Test page content for layout verification.')).toBeTruthy();
    });

    it('renders a <main> element as the page landmark', () => {
      render(<Layout>{TestContent}</Layout>);
      expect(screen.getByRole('main')).toBeTruthy();
    });

    it('gives the <main> element the id "main-content"', () => {
      render(<Layout>{TestContent}</Layout>);
      const main = document.getElementById('main-content');
      expect(main).not.toBeNull();
      expect(main?.tagName.toLowerCase()).toBe('main');
    });

    it('renders children inside the <main> landmark', () => {
      render(<Layout>{TestContent}</Layout>);
      const main = screen.getByRole('main');
      expect(main.querySelector('h1')?.textContent).toBe('Test page heading');
    });
  });

  describe('skip-to-content link', () => {
    it('renders a skip link in the document', () => {
      render(<Layout>{TestContent}</Layout>);
      expect(screen.getByText('Skip to main content')).toBeTruthy();
    });

    it('skip link href targets #main-content', () => {
      render(<Layout>{TestContent}</Layout>);
      const link = screen.getByText('Skip to main content');
      expect(link.getAttribute('href')).toBe('#main-content');
    });

    it('skip link is an <a> element', () => {
      render(<Layout>{TestContent}</Layout>);
      const link = screen.getByText('Skip to main content');
      expect(link.tagName.toLowerCase()).toBe('a');
    });

    it('skip link appears before the main container in the DOM', () => {
      const { container } = render(<Layout>{TestContent}</Layout>);
      const children = Array.from(container.children);
      const skipLinkIndex = children.findIndex(
        (el) => el.tagName.toLowerCase() === 'a'
      );
      const containerIndex = children.findIndex(
        (el) => el.tagName.toLowerCase() === 'div'
      );
      expect(skipLinkIndex).toBeLessThan(containerIndex);
    });
  });

  describe('accessibility', () => {
    it('passes axe-core with a single child heading', async () => {
      const { container } = render(<Layout>{TestContent}</Layout>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe-core when rendering multiple children', async () => {
      const { container } = render(
        <Layout>
          <h1>Multiple children heading</h1>
          <nav aria-label="Section navigation">
            <ul>
              <li><a href="#one">Section one</a></li>
            </ul>
          </nav>
          <section aria-labelledby="sec-one">
            <h2 id="sec-one">Section one</h2>
            <p>Supporting content.</p>
          </section>
        </Layout>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
