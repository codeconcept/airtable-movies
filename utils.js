function formatData(data) {
  return data.map(item => ({
      id: item.id,
      ...item.fields
  }))
}

export default {
  formatData,
};
