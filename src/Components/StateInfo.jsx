const StateInfo = ({id, flag, name, capital, population}) => {
    return (
        <div className="row">
            <img src={flag} alt={`Flag of ${name}`} width="40" />
            <span className="state-name">{name}</span>
            <span className="state-capital">{capital}</span>
            <span className="state-population">{population}</span>
        </div>
    );
};

export default StateInfo;