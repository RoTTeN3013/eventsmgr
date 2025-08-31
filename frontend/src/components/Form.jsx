
const Form = ({inputs, header}) => {
  return (
    <div className="form container-fluid d-flex justify-content-center align-items-center flex-column gap-3">
        <div className="form-header d-flex gap-2 align-items-center justify-content-center">
            <i className={`fa-solid ${header.icon} fa-2x`}></i>
            <h5 className="m-0 p-0">{header.title}</h5>
        </div>
        <div className="form-container">
            <div className="d-flex justify-content-center gap-5 align-items-center flex-column">
                {Object.values(inputs).map((input, index) => {
                    if (input.type === 'select') {
                        return (
                            <div key={index} className="form-group">
                                <label htmlFor="" className="control-label">{input.label}</label>
                                <select value={input.value} onChange={input.handler} className="form-control">
                                    {Object.values(input.options).map((option, optIndex) => (
                                        <option key={optIndex} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        )
                    }else if(input.type === 'submit') {
                        return (
                            <div key={index} className="form-group d-flex justify-content-center">
                                <input type="submit" onClick={input.handler} className="btn btn-dark" value={input.label} />
                            </div>
                        )
                    }else if(input.type === 'texarea') {
                        return (
                            <div key={index} className="form-group d-flex justify-content-center">
                                <textarea className="form-control" rows={input.rows} value={input.value}></textarea>ű
                            </div>
                        )
                    }else {
                        return (
                            <div key={index} className="form-group">
                                <label htmlFor="" className="control-label">{input.label}</label>
                                <input type={input.type} onChange={input.handler} className="form-control" value={input.value} />
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    </div>
  )
}

export default Form