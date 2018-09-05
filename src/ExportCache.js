let currentExport = '';

const getExport = () => currentExport;
const updateExport = input => currentExport = input;

export default {
  getExport: getExport,
  updateExport: updateExport
}