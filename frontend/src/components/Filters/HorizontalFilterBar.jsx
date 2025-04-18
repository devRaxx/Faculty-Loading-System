import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const HorizontalFilterBar = () => {
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
        <div className="flex flex-row justify-between space-x-5">
            <div className="flex flex-col items-start bg-placebo-turquoise border border-enamelled-jewel p-4">
                <p className="text-2xl text-enamelled-jewel-text font-bold">CSM</p>
                <div className="text-enamelled-jewel-text font-medium"><input type="checkbox" onChange={(e) => { handleCheck(e) }} value="DMPCS" /> DMPCS </div>
                <div className="text-enamelled-jewel-text font-medium"><input type="checkbox" onChange={(e) => { handleCheck(e) }} value="DFSC" /> DFSC  </div>
                <div className="text-enamelled-jewel-text font-medium"><input type="checkbox" onChange={(e) => { handleCheck(e) }} value="DBSES" /> DBSES </div>
            </div>
            <div className="flex flex-col items-start bg-placebo-turquoise border border-enamelled-jewel p-4 pr-6">
                <p className="text-2xl text-enamelled-jewel-text font-bold">CHSS</p>
                <div className="text-enamelled-jewel-text font-medium"><input type="checkbox" onChange={(e) => { handleCheck(e) }} value="HSS" /> HSS </div>
            </div>
            <div className="flex flex-col items-start bg-placebo-turquoise border border-enamelled-jewel p-4 pr-6">
                <p className="text-2xl text-enamelled-jewel-text font-bold">SOM</p>
                <div className="text-enamelled-jewel-text font-medium"><input type="checkbox" onChange={(e) => { handleCheck(e) }} value="SOM" /> SOM </div>
            </div>
        </div>
    )
}

export default HorizontalFilterBar