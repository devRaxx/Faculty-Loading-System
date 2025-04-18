const RemarksMaker = ({mainRemarks, setMainRemarks}) => {
    return (
        <div className='w-1/2'>
            <p className='text-3xl font-bold'>Remarks</p>
            <textarea className='w-full border-2 border-black rounded-lg pl-1' value={mainRemarks} onChange={(e)=>{setMainRemarks(e.target.value)}}></textarea>
        </div>
    )
}

export default RemarksMaker