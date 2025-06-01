'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { destinations1 } from '../../../data/desinations.js';

const Destinations = () => {
  const [filterOption, setFilterOption] = useState('africa'); // Default to 'africa' since 'all' is removed
  const [filteredItems, setFilteredItems] = useState([]);

  const filterOptions = [
    { label: 'Africa', value: 'africa' },
    { label: 'Asia', value: 'asia' },
    { label: 'Central America & Caribbean', value: 'central_america_and_caribbean' },
    { label: 'Europe', value: 'europe' },
    { label: 'Middle East', value: 'middle_east' },
    { label: 'North America', value: 'north_america' },
    { label: 'Australia & Pacific', value: 'pacific_ocean_and_australia' },
    { label: 'South America', value: 'south_america' },
  ];

  useEffect(() => {
    if (Array.isArray(destinations1)) {
      setFilteredItems(destinations1.filter((elm) => elm.region === filterOption));
    } else {
      console.error('Destinations data is not an array:', destinations1);
      setFilteredItems([]);
    }
  }, [filterOption]);

  return (
    <>
      <div className="tabs__controls d-flex js-tabs-controls">
        {filterOptions.map((option) => (
          <div key={option.value}>
            <button
              className={`tabs__button fw-500 text-15 px-30 py-15 rounded-4 js-tabs-button ${
                filterOption === option.value ? 'is-tab-el-active' : ''
              }`}
              onClick={() => setFilterOption(option.value)}
            >
              {option.label}
            </button>
          </div>
        ))}
      </div>

      <div className="tabs__content pt-30 js-tabs-content">
        <div className="tabs__pane -tab-item-1 is-tab-el-active">
          <div className="row y-gap-20">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div className="w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/2" key={item.id}>
                  <Link
                    href={item.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-block"
                  >
                    <div className="text-15 fw-500">{item.city}</div>
                    <div className="text-14 text-light-1">{item.properties} properties</div>
                  </Link>
                </div>
              ))
            ) : (
              <div>No destinations available for this region.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Destinations;