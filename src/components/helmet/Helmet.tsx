import React from 'react';

import { Helmet } from 'react-helmet';

export default ({ title, content }: { title: string, content: string }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={content} />
  </Helmet>
);
