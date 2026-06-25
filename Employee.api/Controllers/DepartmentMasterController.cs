using Employee.api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Employee.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentMasterController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public DepartmentMasterController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllDepartments")]
        public ActionResult<IEnumerable<Department>> GetDepartments()
        {
            var departments = _context.Departments.ToList();
            return Ok(departments);
        }

        [HttpGet("GetDepartmentById/{id}")]
        public ActionResult<Department> GetDepartmentById(int id)
        {
            var department = _context.Departments.FirstOrDefault(d => d.DepartmentId == id);
            if (department == null)
                return NotFound();
            return Ok(department);
        }

        [HttpPost("CreateDepartment")]
        public ActionResult<Department> CreateDepartment([FromBody] Department department)
        {
            // Check if department name already exists
            if (_context.Departments.Any(d => d.DepartmentName == department.DepartmentName))
            {
                return BadRequest(new { message = "Department must be unique." });
            }

            _context.Departments.Add(department);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetDepartmentById), new { id = department.DepartmentId }, department);
        }

        [HttpPut("UpdateDepartment/{id}")]
        public ActionResult<Department> UpdateDepartment(int id, [FromBody] Department updatedDepartment)
        {
            //var department = _context.Departments.FirstOrDefault(d => d.DepartmentId == id);
            var department = _context.Departments.Find(id);
            if (department == null)
                return NotFound();
            department.DepartmentName = updatedDepartment.DepartmentName;
            department.IsActive = updatedDepartment.IsActive;
            _context.SaveChanges();
            return Ok(department);
        }

        [HttpDelete("DeleteDepartment/{id}")]
        public ActionResult DeleteDepartment(int id)
        {
            var department = _context.Departments.FirstOrDefault(d => d.DepartmentId == id);
            if (department == null)
                return NotFound();
            _context.Departments.Remove(department);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
