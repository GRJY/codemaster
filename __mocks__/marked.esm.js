// Bu dosya, Jest test ortamı için 'marked' kütüphanesini taklit eder.
// Gerçek kütüphaneyi yüklemek yerine, bu sahte fonksiyonları kullanır.
export const marked = {
  // `parse` fonksiyonu, testlerde beklendiği gibi bir dize döndürür.
  parse: (markdown) => {
    return `<p>${markdown}</p>`;
  },
};
