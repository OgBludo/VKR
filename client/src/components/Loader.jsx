import React from 'react';
import ContentLoader from 'react-content-loader';

const MyLoader = () => (
  <div className="programms programmsSkeleton">
    <div className="container">
      <ContentLoader speed={2} height={240} backgroundColor="#bfbfbf" foregroundColor="#ecebeb">
        <rect width="100%" height="100%" />
      </ContentLoader>
    </div>
  </div>
);

export default MyLoader;
