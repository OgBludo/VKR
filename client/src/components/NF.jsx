import React from 'react';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Страница не найдена</p>
      <a href="/" className="link-home">
        Вернуться на главную
      </a>
    </div>
  );
};

export default NotFound;
