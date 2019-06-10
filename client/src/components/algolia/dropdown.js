import React from "react";

// wip wip wip
class Dropdown extends React.Component {
    render() {
        console.log(this.props.indexHelper);
        return (
            <div className={`filter ${this.props.open ? "is-open" : ""}`} style={this.props.style} id={this.props.id} data-dropdown data-auto-focus="true">
                <div className="filter-dropdown">
                    <div className="filter-dropdown__top">
                        <h5 className="gray bold">{this.props.title}</h5>
                        {
                            false ? null
                            : <p className="pink">{this.props.indexHelper.state.facetsRefinements[this.props.facetType]} selected</p>
                        }
                    </div>
                    <div className="filter-dropdown__main">
                        {
                            !true && <p>No relevant filters</p>
                        }
                        {
                            this.props.indexHelper.lastResults && this.props.indexHelper.lastResults.facets.map(facet => {
                                {/* let facet = this.props.indexHelper.state.facetsRefinements[facet_key] */}
                                if (facet.name !== this.props.facetType) return;
                                let facet_names = Object.keys(facet.data)
                                console.log(facet);
                                return facet_names.map(facet => {
                                    let active = this.props.indexHelper.state.facetsRefinements[facet.name] &&
                                        this.props.indexHelper.state.facetsRefinements[facet.name].indexOf(facet);
                                    return (
                                    <label className={`radio__container ${active ? 'checked' : ''}`}>
                                        <label className="gray bold">{facet}</label>
                                        <input
                                            className="ic"
                                            type="checkbox"
                                            id={facet}
                                            checked={active}
                                            name={1}
                                            value={1}
                                            onClick={(e) => this.props.handleFilterClick(e, facet)}
                                        />
                                        <span className="checkmark" />
                                    </label>
                                    )
                                })
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Dropdown;