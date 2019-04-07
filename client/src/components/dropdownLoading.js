import React from "react";

class DropdownLoading extends React.Component {
   render(){
      return (
         <div className="filter-dropdown">
           <div className="filter-dropdown__top">
             <label className="radio-t rde" style={{width: '60%'}}>
               <p className="gray bold" />
               <input className="ic" type="radio" name="radio-t" />
             </label>
             <label className="radio-t rde" style={{width: '30%'}}>
               <p className="gray bold" />
               <input className="ic" type="radio" name="radio-t" />
             </label>
           </div>
           <div className="filter-dropdown__main">
             <label className="radio-t rde">
               <p className="gray bold" />
               <input className="ic" type="radio" name="radio-t" />
             </label>
             <label className="radio-t rde">
               <p className="gray bold" />
               <input className="ic" type="radio" name="radio-t" />
             </label>
             <label className="radio-t rde">
               <p className="gray bold" />
               <input className="ic" type="radio" name="radio-t" />
             </label>
           </div>
         </div>
      );
   }
}

export default DropdownLoading