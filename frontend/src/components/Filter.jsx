
const Filter = ({filters}) => {
  return (
    <div className="filter-container">

            <div className="d-flex justify-content-center gap-5 align-items-center">
                {Object.values(filters).map((input, index) => (
                    input.type === 'select' ? (
                        <div key={index} className="form-group">
                            <label htmlFor="" className="control-label"><i className="fa fa-sort"> </i>{input.label}</label>
                            <select onChange={input.handler} className="form-control">
                                {Object.values(input.options).map((option, index) => (
                                    <option key={index} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div key={index} className="form-group">
                            <label htmlFor="" className="control-label"><i className="fa fa-sort"> </i>{input.label}</label>
                            <input type={input.type} onChange={input.handler} className="form-control" />
                        </div>
                    )
                ))}
            </div>

    </div>
  )
}

export default Filter