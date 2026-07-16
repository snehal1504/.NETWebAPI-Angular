using Employee.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Employee.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DepartmentMasterController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public DepartmentMasterController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Department>>> GetDepartments()
        {
            var departments = await _context.Departments.ToListAsync();
            return Ok(departments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Department>> GetDepartmentById(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
                return NotFound();
            return Ok(department);
        }

        [HttpPost]
        public async Task<ActionResult<Department>> CreateDepartment([FromBody] Department department)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _context.Departments.AnyAsync(d => d.DepartmentName.Equals(department.DepartmentName, StringComparison.OrdinalIgnoreCase)))
            {
                return BadRequest(new { message = "Department must be unique." });
            }

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDepartmentById), new { id = department.DepartmentId }, department);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Department>> UpdateDepartment(int id, [FromBody] Department updatedDepartment)
        {
            if (id != updatedDepartment.DepartmentId)
                return BadRequest("Id mismatch");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingDepartment = await _context.Departments.FindAsync(id);
            if (existingDepartment == null)
                return NotFound();

            if (await _context.Departments.AnyAsync(d => d.DepartmentId != id && d.DepartmentName.Equals(updatedDepartment.DepartmentName, StringComparison.OrdinalIgnoreCase)))
            {
                return BadRequest(new { message = "Department must be unique." });
            }

            existingDepartment.DepartmentName = updatedDepartment.DepartmentName;
            existingDepartment.IsActive = updatedDepartment.IsActive;
            await _context.SaveChangesAsync();
            return Ok(existingDepartment);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDepartment(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
                return NotFound();

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
