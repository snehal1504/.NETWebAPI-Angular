using Employee.api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class DesignationMasterController : ControllerBase
{
    private readonly EmployeeDbContext _context;

    public DesignationMasterController(EmployeeDbContext context)
    {
        _context = context;
    }

    // ✅ GET All
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var designations = await _context.Designations.ToListAsync();
            return Ok(designations);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // ✅ GET by Id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var designation = await _context.Designations.FindAsync(id);
            if (designation == null) return NotFound("Designation not found");
            return Ok(designation);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // ✅ CREATE
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Designation designation)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (await _context.Designations.AnyAsync(d => d.DesignationName.Equals(designation.DesignationName, StringComparison.OrdinalIgnoreCase)))
            {
                return BadRequest(new { message = "Designation must be unique." });
            }

            _context.Designations.Add(designation);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = designation.DesignationId }, designation);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // ✅ UPDATE
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Designation designation)
    {
        try
        {
            if (id != designation.DesignationId) return BadRequest("Id mismatch");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Entry(designation).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(designation);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Designations.Any(d => d.DesignationId == id))
                return NotFound("Designation not found");
            throw;
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // ✅ DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var designation = await _context.Designations.FindAsync(id);
            if (designation == null) return NotFound("Designation not found");

            _context.Designations.Remove(designation);
            await _context.SaveChangesAsync();
            return Ok("Deleted successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // ✅ FILTER API (by DepartmentId)
    [HttpGet("filter/{departmentId}")]
    public async Task<IActionResult> GetByDepartment(int departmentId)
    {
        try
        {
            var designations = await _context.Designations
                .Where(d => d.DepartmentId == departmentId)
                .ToListAsync();

            if (!designations.Any()) return NotFound("No designations found for this department");
            return Ok(designations);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
