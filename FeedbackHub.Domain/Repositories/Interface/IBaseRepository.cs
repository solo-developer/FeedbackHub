using System.Linq.Expressions;

namespace FeedbackHub.Domain.Repositories.Interface
{
    public interface IBaseRepository<T>
    {
        void Dispose();
        Task InsertAsync(T t);
        int Count();
        Task<int> CountAsync();
        Task<int> DeleteAsync(T entity);
        T Find(Expression<Func<T, bool>> match);
        List<T> FindAll(Expression<Func<T, bool>> match);
        Task<List<T>> FindAllAsync(Expression<Func<T, bool>> match);
        Task<T> FindAsync(Expression<Func<T, bool>> match);
        IQueryable<T> FindBy(Expression<Func<T, bool>> predicate);
        Task<List<T>> FindByAsync(Expression<Func<T, bool>> predicate);
        Task<List<T>> GetAllAsync();
        IQueryable<T> GetAllIncluding(params Expression<Func<T, object>>[] includeProperties);
        Task<T> GetByIdAsync(int id);
        Task<T> UpdateAsync(T t, object key);
        void Delete(T entity);
        void DeleteRange(List<T> entities);
        void Insert(T entity);
        void InsertRange(List<T> entities);
        void Update(T entity);
        List<T> GetAll();
        T GetById(int id);
        IQueryable<T> GetQueryable();
        IQueryable<T> GetQueryableWithNoTracking();
    }
}
