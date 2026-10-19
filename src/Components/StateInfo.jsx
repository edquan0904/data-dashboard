const StateInfo = ({ flag, name, capital, year, population }) => {
    return (
        <div className="row">
            <img src={flag} alt={`Flag of ${name}`} />
            <span className="state-name">{name}</span>
            <span className="state-capital">{capital}</span>
            <span className="state-year">{year}</span>
            <span className="state-population">{population}</span>
        </div>
    );
};

export default StateInfo;