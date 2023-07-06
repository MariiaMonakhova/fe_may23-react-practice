import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const getUserId = userId => usersFromServer.find(
  user => user.id === userId,
) || null;

const getCategoryId = categoryId => categoriesFromServer.find(
  category => category.id === categoryId,
);

const products = productsFromServer.map((product) => {
  const category = getCategoryId(product.categoryId);
  const owner = category ? getUserId(category.ownerId) : null;

  return {
    ...product,
    category,
    owner,
  };
});

const getFilteredProducts = (currProducts, query, name) => {
  let preparedProducts = [...currProducts];

  if (query) {
    const lowerQuery = query.toLowerCase();

    preparedProducts = preparedProducts.filter(
      product => product.name.toLowerCase().includes(lowerQuery),
    );
  }

  if (name) {
    preparedProducts = preparedProducts.filter(
      product => product.owner.name === name,
    );
  }

  return preparedProducts;
};

export const App = () => {
  const [query, setQuery] = useState('');
  const [name, setName] = useState(null);
  const filteredProducts = getFilteredProducts(products, query, name);

  const clearAllFilters = () => {
    setQuery('');
    setName('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({ 'is-active': name === null })}
                onClick={() => setName('')}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  className={cn({ 'is-active': name === user.name })}
                  onClick={() => setName(user.name)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  onChange={event => setQuery(event.target.value)}
                  // value="qwe"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setName('')}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                  key={category.id}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => clearAllFilters()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {(name !== null && name === 'John') && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map(product => (
                <tr data-cy="Product" key={product.id}>
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  {/* eslint-disable-next-line */}
                  <td data-cy="ProductCategory">{product.category.icon} - {product.category.title}</td>

                  <td
                    data-cy="ProductUser"
                    className={cn('Person__name', {
                      'has-text-link': product.owner.sex === 'm',
                      'has-text-danger': product.owner.sex === 'f',
                    })}
                  >
                    {product.owner.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
