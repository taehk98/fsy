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
        // console.log(data);

        const formattedOptions = data.map(item => ({
          value: item.teamName || item.activity,
          label: item.teamName || item.activity
        }));
        // console.log(formattedOptions);
        var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
        const options = formattedOptions.sort((a, b) => collator.compare(a.label, b.label));

        setOptions(options);
      } catch (error) {
        toast.error('데이터를 가져오는데 실패했습니다', {
          duration: 3000,
        });
      }
    };

    fetchData();
  }, [endpoint]);

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      maxHeight: '150px', // 원하는 높이로 설정
      overflowY: 'auto', // overflow 설정
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '150px', // 메뉴 리스트의 최대 높이 설정
    }),
  };

  return (
    <Select
      className="basic-single md:w-96 w-3/5 h-full"
      classNamePrefix="select"
      isSearchable={true}
      placeholder={placeholder}
      options={options}
      onChange={onChange}
      styles={customStyles}
    />
  );
};

export default Dropdown;
