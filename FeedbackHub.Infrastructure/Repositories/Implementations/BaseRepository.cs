using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FeedbackHub.Infrastructure.Repository.Implementations
{
    /// <summary>
    /// Common Repository class to manipulate / extract data from any table in database 
    /// </summary>
    /// <typeparam name="T"> Generic Class in which any of the ENTITY can be passed. Datas will be manipulated/extracted to and from the table of specified class</typeparam>
    public  class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        private readonly AppDbContext _context;
        public BaseRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<T> GetAllQueryable()
        {
            return _context.Set<T>();
        }

        public virtual async Task InsertAsync(T t)
        {
            _context.Set<T>().Add(t);
            await _context.SaveChangesAsync();
        }

        public virtual int Count()
        {
            return _context.Set<T>().Count();
        }

        public virtual async Task<int> CountAsync()
        {
            return await _context.Set<T>().CountAsync();
        }

        /// <summary>
        /// deletes a row from table
        /// </summary>
        /// <param name="entity">row to be deleted</param>
        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
            _context.SaveChanges();
        }

        public virtual async Task<int> DeleteAsync(T entity)
        {
            _context.Set<T>().Remove(entity);
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// deletes multiple row at once from a table
        /// </summary>
        /// <param name="entity">rows to be deleted</param>
        public void DeleteRange(List<T> entities)
        {
            _context.Set<T>().RemoveRange(entities);
        }

        public virtual T Find(Expression<Func<T, bool>> match)
        {
            return _context.Set<T>().SingleOrDefault(match);
        }

        public virtual List<T> FindAll(Expression<Func<T, bool>> match)
        {
            return _context.Set<T>().Where(match).ToList();
        }

        public virtual async Task<List<T>> FindAllAsync(Expression<Func<T, bool>> match)
        {
            return await _context.Set<T>().Where(match).ToListAsync();
        }

        public virtual async Task<T> FindAsync(Expression<Func<T, bool>> match)
        {
            return await _context.Set<T>().SingleOrDefaultAsync(match);
        }

        public virtual IQueryable<T> FindBy(Expression<Func<T, bool>> predicate)
        {
            IQueryable<T> query = _context.Set<T>().Where(predicate);
            return query;
        }

        public virtual async Task<List<T>> FindByAsync(Expression<Func<T, bool>> predicate)
        {
            return await _context.Set<T>().Where(predicate).ToListAsync();
        }

        /// <summary>
        ///  call this method to get all rows from table
        /// </summary>
        /// <returns> all rows in specified table</returns>
        public List<T> GetAll()
        {
            return _context.Set<T>().ToList();
        }

        public virtual async Task<List<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public virtual IQueryable<T> GetAllIncluding(params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> queryable = GetAllQueryable();
            foreach (Expression<Func<T, object>> includeProperty in includeProperties)
            {
                queryable = queryable.Include<T, object>(includeProperty);
            }

            return queryable;
        }

        /// <summary>
        ///  get data by primary key id
        /// </summary>
        /// <param name="id"> primary key value of table</param>
        /// <returns>single row with specified primary key value</returns>
        public T GetById(long id)
        {
            return _context.Set<T>().Find(id);
        }

        public virtual async Task<T> GetByIdAsync(long id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        /// <summary>
        ///  provides interface to build query by caller
        /// </summary>
        /// <returns>returns query builder interface . used to fetch data after certain conditions are met</returns>
        public virtual IQueryable<T> GetQueryable()
        {
            return _context.Set<T>();
        }

        /// <summary>
        ///  provides interface to build query by caller but doesnot track entities, meaning that changes cannot be made to database after calling this method and saving / updating those datas
        /// </summary>
        /// <returns>returns query builder interface . used to fetch data after certain conditions are met</returns>
        public virtual IQueryable<T> GetQueryableWithNoTracking()
        {
            return _context.Set<T>().AsNoTracking();
        }

        /// <summary>
        /// inserts a row into table
        /// </summary>
        /// <param name="entity"> row description</param>
        public void Insert(T entity)
        {
            _context.Set<T>().Add(entity);
            _context.SaveChanges();
        }

        /// <summary>
        /// inserts multiple rows at once 
        /// </summary>
        /// <param name="entities"></param>
        public void InsertRange(List<T> entities)
        {
            _context.Set<T>().AddRange(entities);
            _context.SaveChanges();
        }

        /// <summary>
        /// updates a row based on primary key value of entity
        /// </summary>
        /// <param name="entity"> row description</param>
        public void Update(T entity)
        {
            if (_context.Entry(entity).State != EntityState.Detached)
            {
                _context.SaveChanges();
            }
        }

        public virtual async Task<T> UpdateAsync(T t, object key)
        {
            if (t == null)
                return null;
            T exist = await _context.Set<T>().FindAsync(key);
            if (exist != null)
            {
                _context.Entry(exist).CurrentValues.SetValues(t);
                await _context.SaveChangesAsync();
            }
            return exist;
        }

        private bool disposed = false;
        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
                this.disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
