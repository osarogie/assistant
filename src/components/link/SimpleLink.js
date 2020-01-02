import NextLink from 'next/link'
import React from 'react'

export function SimpleLink({
  as,
  passHref, // ignore
  scroll,
  shallow,
  replace,
  href,
  prefetch,
  ...rest
}) {
  return (
    <NextLink
      href={href}
      passHref={true}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
    >
      <a {...rest} />
    </NextLink>
  )
}
