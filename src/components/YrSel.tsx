import React, { ChangeEvent } from 'react';
import { Select } from 'pix0-core-ui';

interface YearSelectProps {
    onChange?: (year: number) => void,

    value? : string, 
}

export default function YrSel({ onChange, value  }: YearSelectProps)  {

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, index) => currentYear - index);

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedYear = parseInt(event.target.value);

        if ( onChange)
            onChange(selectedYear);
    };

    return  <Select className="w-40" value={value}
    onChange={handleChange}
        options={ [{value:"-", label:"-"}, ...years.map((year) => (
            {value : `${year}`, label: `${year}`}
          ))]}
    />
};
