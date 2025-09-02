
const Filter = ({filters, filterButton}) => {
  return (
    <div className="filter-container">

            <div className="d-flex flex-lg-row flex-column justify-content-center gap-lg-5 gap-2 align-items-lg-end align-items-center">
                {Object.values(filters).map((input, index) => (
                    input.type === 'select' ? (
                        <div key={index} className="form-group animate__animated animate__fadeInDown col-lg-1 col-10" style={{ animationDelay: `${index * 100}ms` }}>
                            <label htmlFor="" className="control-label"><i className="fa fa-sort"> </i>{input.label}</label>
                            <select onChange={input.handler} className="form-control">
                                {Object.values(input.options).map((option, index) => (
                                    <option key={index} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div key={index} className="form-group animate__animated animate__fadeInDown col-lg-1 col-10" style={{ animationDelay: `${index * 100}ms` }}>
                            <label htmlFor="" className="control-label"><i className="fa fa-sort"> </i>{input.label}</label>
                            <input type={input.type} onChange={input.handler} className="form-control" />
                        </div>
                    )
                ))}
                <button className="btn btn-dark animate__animated animate__fadeInDown col-lg-1 col-10" onClick={filterButton.handler}><i className="fa fa-magnifying-glass"></i> {filterButton.label}</button>
            </div>

    </div>
  )
}

export default Filter