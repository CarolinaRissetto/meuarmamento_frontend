
export default function useLocalStorageClient() {
   const getId = () => {
      return localStorage.getItem('id');
   };

   const setFormData = (data: any) => {
      localStorage.setItem('formData', JSON.stringify(data));
   };

   const clearFormData = () => {
      localStorage.removeItem('formData');
   };

   return {
      getId,
      setFormData,
      clearFormData,
   };
}
