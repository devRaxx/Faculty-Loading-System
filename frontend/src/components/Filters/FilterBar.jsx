import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const FilterBar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [queries, setQueries] = useState([])
    useEffect(() => {
        setSearchParams({ filter: queries })
    }, [queries])

    function handleCheck(event) {
        if (event.target.checked) {
            setQueries([event.target.value, ...queries])
        } else if (!event.target.checked) {
            const temp = queries
            const index = temp.indexOf(event.target.value);
            temp.splice(index, 1);
            setQueries([...temp])
        }
    }

    return (
        <div className="flex flex-col w-48 border border-enamelled-jewel rounded-md shadow-custom">
            <div className="flex items-center justify-center w-full h-20 bg-placebo-turquoise border border-b-enamelled-jewel rounded-tr-md rounded-tl-md">
                <p className="text-4xl text-enamelled-jewel underline font-bold">Filter:</p>
            </div>
            <div className="flex flex-col items-start pl-10 py-5 space-y-5">
                <div className="flex flex-col items-start">
                    <p className="text-2xl text-enamelled-jewel-text font-bold">CSM</p>
                    <div className="text-enamelled-jewel-text font-medium"><input type="checkbox" onChange={(e) => { handleCheck(e) }} value="DMPCS" /> DMPCS </div>
                    <div className="text-enamelled-jewel-text font-medium"><input type="checkbox" onChange={(e) => { handleCheck(e) }} value="DFSC" /> DFSC  </div>
                    <div className="text-enamelled-jewel-text font-medium"><input type="checkbox" onChange={(e) => { handleCheck(e) }} value="DBSES" /> DBSES </div>
                </div>
                <div className="flex flex-col items-start">
                    <p className="text-2xl text-enamelled-jewel-text font-bold">CHSS</p>
                    <div className="text-enamelled-jewel-text font-medium"><input type="checkbox" onChange={(e) => { handleCheck(e) }} value="HSS" /> HSS </div>
                </div>
                <div className="flex flex-col items-start">
                    <p className="text-2xl text-enamelled-jewel-text font-bold">SOM</p>
                    <div className="text-enamelled-jewel-text font-medium"><input type="checkbox" onChange={(e) => { handleCheck(e) }} value="SOM" /> SOM </div>
                </div>
            </div>
        </div>
    )
}

export default FilterBar;