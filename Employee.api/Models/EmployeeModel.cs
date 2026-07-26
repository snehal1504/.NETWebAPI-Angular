using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Employee.api.Models
{
    [Table("Employees")]
    public class EmployeeModel
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EmployeeId { get; set; }

        [Required(ErrorMessage = "First name is required")]
        [StringLength(100, MinimumLength = 3)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(100, MinimumLength = 3)]
        public string LastName { get; set; } = string.Empty;

        [Required, MaxLength(10), MinLength(10)]
        public string ContactNo { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public string State { get; set; } = string.Empty;

        public string PinCode { get; set; } = string.Empty;

        public string AltContactNo { get; set; } = string.Empty;

        [Required, RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$")]
        public string Email { get; set; } = string.Empty;

        public int DesignationId { get; set; }

        public DateOnly HireDate { get; set; }

        public decimal? Salary { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime ModifiedDate { get; set; }

        public string Role { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
    }

    // ✅ DTO for Login
    public class LoginRequest
    {
        [Required, RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$")]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }

    // ✅ DTO for creating an employee with plaintext password
    public class EmployeeCreateRequest
    {
        [Required, StringLength(100, MinimumLength = 3)]
        public string FirstName { get; set; } = string.Empty;

        [Required, StringLength(100, MinimumLength = 3)]
        public string LastName { get; set; } = string.Empty;

        [Required, MaxLength(10), MinLength(10)]
        public string ContactNo { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string PinCode { get; set; } = string.Empty;
        public string AltContactNo { get; set; } = string.Empty;

        [Required, RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$")]
        public string Email { get; set; } = string.Empty;

        public int DesignationId { get; set; }
        public DateOnly HireDate { get; set; }
        public decimal? Salary { get; set; }
        public string Role { get; set; } = string.Empty;

        [Required, MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }
}
