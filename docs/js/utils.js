export default {
    flog: (msg)=>{
        console.log(msg);
    },
    remove_warning: (elementId) => {
      document.getElementById(elementId).style.display = 'none';
    }
};
