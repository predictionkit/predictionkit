import type { MDXComponents } from 'mdx/types';

// Required by @next/mdx in the App Router. Customize MDX element rendering here.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components };
}
