using Employee.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class EmployeeMasterController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly EmployeeDbContext _context;

    public EmployeeMasterController(EmployeeDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    // ✅ GET All Employees
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var employees = await _context.Employees.ToListAsync();
            return Ok(employees);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // ✅ GET by Id
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return NotFound("Employee not found");
            return Ok(employee);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // ✅ CREATE Employee
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] EmployeeCreateRequest request)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (await _context.Employees.AnyAsync(e => e.ContactNo == request.ContactNo))
                return BadRequest("Contact number must be unique");
            if (await _context.Employees.AnyAsync(e => e.Email == request.Email))
                return BadRequest("Email must be unique");

            var employee = new EmployeeModel
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                ContactNo = request.ContactNo,
                Address = request.Address,
                City = request.City,
                State = request.State,
                PinCode = request.PinCode,
                AltContactNo = request.AltContactNo,
                Email = request.Email,
                DesignationId = request.DesignationId,
                HireDate = request.HireDate,
                Salary = request.Salary,
                Role = request.Role,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow
            };

            var hasher = new PasswordHasher<EmployeeModel>();
            employee.Password = hasher.HashPassword(employee, request.Password);

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = employee.EmployeeId }, employee);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    // ✅ UPDATE Employee
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] EmployeeModel employee)
    {
        try
        {
            if (id != employee.EmployeeId) return BadRequest("Id mismatch");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Uniqueness check (excluding current record)
            if (await _context.Employees.AnyAsync(e => e.ContactNo == employee.ContactNo && e.EmployeeId != id))
                return BadRequest("Contact number must be unique");
            if (await _context.Employees.AnyAsync(e => e.Email == employee.Email && e.EmployeeId != id))
                return BadRequest("Email must be unique");

            employee.ModifiedDate = DateTime.UtcNow;

            _context.Entry(employee).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(employee);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Employees.Any(e => e.EmployeeId == id))
                return NotFound("Employee not found");
            throw;
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // ✅ DELETE Employee
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return NotFound("Employee not found");

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return Ok("Deleted successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // ✅ FILTER + SORT + PAGINATION
    // Example: api/employees/filter?search=Snehal&sortBy=FirstName&sortOrder=asc&page=1&pageSize=5
    [Authorize]
    [HttpGet("filter")]
    public async Task<IActionResult> Filter(
        string? search,
        string? sortBy = "FirstName",
        string? sortOrder = "asc",
        int page = 1,
        int pageSize = 10)
    {
        try
        {
            var query = _context.Employees.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(e =>
                    e.FirstName.Contains(search) ||
                    e.LastName.Contains(search) ||
                    e.Email.Contains(search));
            }

            query = sortOrder?.ToLower() == "desc"
                ? query.OrderByDescending(e => EF.Property<object>(e, sortBy))
                : query.OrderBy(e => EF.Property<object>(e, sortBy));

            var totalRecords = await query.CountAsync();
            var employees = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return Ok(new
            {
                totalRecords,
                page,
                pageSize,
                data = employees
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // ✅ Login API
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Email == request.Email);
        if (employee == null) return Unauthorized("Invalid email or password");

        var hasher = new PasswordHasher<EmployeeModel>();
        var result = hasher.VerifyHashedPassword(employee, employee.Password, request.Password);

        if (result == PasswordVerificationResult.Failed)
            return Unauthorized("Invalid email or password");

        // ✅ Generate JWT
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, employee.Email),
            new Claim("EmployeeId", employee.EmployeeId.ToString()),
            new Claim("Role", employee.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return Ok(new
        {
            Message = "Login successful",
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            data = new
            {
                employee.EmployeeId,
                employee.Role, 
                employee.Email, 
                employee.FirstName,
                employee.ContactNo,
                employee.DesignationId
            }
        });
    }

}
