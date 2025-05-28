

export const formatDate = (date ?:Date)=> {

    if(!date) return null
    return new Date(date).toLocaleDateString('en-EN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      // Example output: "jeudi 15 mai 2025"
      
}