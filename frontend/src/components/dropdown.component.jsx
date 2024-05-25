import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-hot-toast';

const Dropdown = ({ endpoint, placeholder, onChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log(data);

        const formattedOptions = data.map(item => ({
          value: item.teamName || item.activity,
          label: item.teamName || item.activity
        }));
        // console.log(formattedOptions);

        setOptions(formattedOptions);
      } catch (error) {
        toast.error('Failed to fetch data for dropdown.', {
          duration: 3000,
        });
      }
    };

    fetchData();
  }, [endpoint]);

  return (
    <Select
      className="basic-single w-full h-full"
      classNamePrefix="select"
      isSearchable={true}
      placeholder={placeholder}
      options={options}
      onChange={onChange}
    />
  );
};

export default Dropdown;
